import { ObjectId } from "mongodb"
import { getDatabaseConnection } from "../database"
import { generatePetPersonality } from "../modules/generatePet"
import { performAction } from "../modules/performAction"
import { OpenAI } from "langchain/llms/openai";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { TimeWeightedVectorStoreRetriever } from "langchain/retrievers/time_weighted";
import {
    GenerativeAgentMemory,
    GenerativeAgent,
} from "langchain/experimental/generative_agents";

async function loadMemories(db, id) {
    try {
        //Check if the pet already has a personality

    } catch (err) {
        console.error(err)
    }
}
export default async function startConversation(req, res) {
    //TODO: Store history everytime in perform action
    try {
        const db = getDatabaseConnection()

        const { id } = req
        const { memory } = req.body
        const historydoc = await db.collection("history")
        const petdoc = await db.collection("pets")
        const history = await historydoc.findOne({ "id": id })
        const petData = await petdoc.findOne({ "_id": new ObjectId(id) })

        const API_KEY = process.env.OPENAI_API_KEY

        const llm = new OpenAI({
            temperature: 0.9,
            openAIApiKey: API_KEY,
            maxTokens: 1500,
        });

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
            name: petData.name,
            age: 0,
            traits: "You're a tamagotchi pet, you sometimes feel hungry, you sometimes feel the need to bath, you feel human emotions",
            status: "You just got visited by your owner"
        });


        let petInstance: GenerativeAgent = petData.data

        petInstance = new GenerativeAgent(petInstance.llm, petInstance.longTermMemory, {
            name: petInstance.name,
            age: petInstance.age,
            traits: petInstance.traits,
            status: petInstance.status
        })

        const action = history === null ? "CREATE" : "VISIT"

        if (req.body.memory === "enabled") {
            await loadMemories(db, id)
        }

        let response = await performAction(id, pet?.name, pet?.age, action, memory)

        return res.status(200).send(response)
    } catch (err) {
        console.error(err)
        res.status(500).send({ message: "There was an error", error: err })
    }
}