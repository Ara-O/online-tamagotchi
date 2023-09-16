import { Collection } from "mongodb"
import { getDatabaseConnection } from "../database"
import { OpenAI } from "langchain/llms/openai";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { TimeWeightedVectorStoreRetriever } from "langchain/retrievers/time_weighted";
import {
    GenerativeAgentMemory,
    GenerativeAgent,
} from "langchain/experimental/generative_agents";

export default async function (req, res) {
    const db = getDatabaseConnection()

    const API_KEY = process.env.OPENAI_API_KEY

    const llm = new OpenAI({
        temperature: 0.9,
        openAIApiKey: API_KEY,
        maxTokens: 1500,
    });

    try {
        if (!req.body.petName) {
            req.body.petName = "Bobby"
        }

        let sanitizedPetName = req.body.petName.trim()

        let collection: Collection = db.collection("pets")

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
            name: sanitizedPetName,
            age: 0,
            traits: "You're a tamagotchi pet, you sometimes feel hungry, you sometimes feel the need to bath, you feel human emotions",
            status: "You just got created as a pet by your owner"
        });

        let doc = await collection.insertOne({
            name: sanitizedPetName,
            age: 0,
            created: Date.now(),
            data: pet
        })

        res.status(200).send({ message: "Pet successfully created", id: doc.insertedId })

    } catch (err) {
        res.status(400).send({ message: "Error creating pet" })
    }
}