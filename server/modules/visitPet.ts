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

const interviewAgent = async (
    agent: GenerativeAgent,
    message: string
): Promise<string> => {
    const newMessage = `Your owner says ${message}`;
    const response = await agent.generateDialogueResponse(newMessage);
    return response[1];
};

export async function visitPet(id: string, name: string, age: number, action?: string) {

    try {
        const connection = getDatabaseConnection()

        const db: Collection = connection.collection("history")

        await db.updateOne({ id }, {
            $push: {
                history: `You were visited by your owner on ${new Date(Date.now()).toLocaleString()}`
            }
        })

        let history = await db.findOne({ id })

        // console.log(history)

        const API_KEY = process.env.OPENAI_API_KEY

        const llm = new OpenAI({
            temperature: 0.9,
            openAIApiKey: API_KEY,
            maxTokens: 1500,
        });

        //Generate trait and store in database
        const Simulation = async () => {
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

                // for (const memory of history.history) {
                //     await pet.addMemory(memory, new Date());
                //     console.log("Adding memory...")
                // }

                if (!action) {
                    let petResponse = await pet.generateReaction("Your owner is visiting you, your owner asks of you to address them in first person, for example, you should react like 'I am happy to see you. Do not refer to your owner as 'owner', refer to them as you")
                    return petResponse
                } else {
                    let petResponse = await pet.generateReaction(action)
                    return petResponse
                }

            } catch (err) {
                console.error(err)
                throw new Error(err)
            }
        }


        let petResponse = await Simulation();

        return petResponse[1]
    } catch (err) {
        throw new Error(err)
    }
}