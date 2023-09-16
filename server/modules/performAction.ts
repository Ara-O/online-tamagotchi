import { Collection, Db } from "mongodb";

import { OpenAI } from "langchain/llms/openai";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { TimeWeightedVectorStoreRetriever } from "langchain/retrievers/time_weighted";
import {
    GenerativeAgentMemory,
    GenerativeAgent,
} from "langchain/experimental/generative_agents";
import 'dotenv/config'
import { getDatabaseConnection } from "../database";
import { ActionResponseType } from "../types/types";

const interviewAgent = async (
    agent: GenerativeAgent,
    message: string
): Promise<string> => {
    const newMessage = `${message}`;
    const response = await agent.generateDialogueResponse(newMessage);
    return response[1];
};

export async function performAction(id: string, name: string, age: number, action?: string, actionText?: string, memoryEnabled?: "enabled" | "disabled"): Promise<ActionResponseType> {

    try {
        const connection = getDatabaseConnection()

        const db: Collection = connection.collection("history")

        // await db.updateOne({ id }, {
        //     $push: {
        //         history: `You were visited by your owner on ${new Date(Date.now()).toLocaleString()}`
        //     }
        // })

        let history = await db.findOne({ id })

        // console.log(history)

        const API_KEY = process.env.OPENAI_API_KEY

        const llm = new OpenAI({
            temperature: 0.9,
            openAIApiKey: API_KEY,
            maxTokens: 1500,
        });

        //Generate trait and store in database
        const Simulation = async (): Promise<ActionResponseType> => {
            try {
                const createNewMemoryRetriever = async () => {
                    const vectorStore = new MemoryVectorStore(new OpenAIEmbeddings());
                    const retriever = new TimeWeightedVectorStoreRetriever({
                        vectorStore,
                        otherScoreKeys: ["importance"],
                        k: 15,
                    });
                    return retriever;
                };

                const petsMemory: GenerativeAgentMemory = new GenerativeAgentMemory(
                    llm,
                    await createNewMemoryRetriever(),
                    { reflectionThreshold: 8 }
                );

                const pet: GenerativeAgent = new GenerativeAgent(llm, petsMemory, {
                    name,
                    age,
                    traits: "You're a tamagotchi pet, you sometimes feel hungry, you sometimes feel the need to bath, you feel human emotions",
                    status: "You just got visited by your owner"
                });

                if (memoryEnabled) {
                    console.log("Memory Enabled: ")
                    for (const memory of history.history) {
                        await pet.addMemory(memory, new Date());
                        console.log("Adding memory...")
                    }
                }


                let res = await Promise.all([pet.generateReaction(action), interviewAgent(pet, action)])
                let petResponse = res[0]
                let interviewRes = res[1]

                const response: ActionResponseType = {
                    actionPrompt: action,
                    petThought: interviewRes,
                    petResponse: petResponse
                }

                // const response: ActionResponseType = {
                //     actionPrompt: action,
                //     petThought: "This is a test",
                //     petResponse: [false, "test"]
                // }

                return response

            } catch (err) {
                console.error(err)
                throw new Error(err)
            }
        }

        let petResponse: ActionResponseType = await Simulation();

        return petResponse as ActionResponseType
    } catch (err) {
        throw new Error(err)
    }
}