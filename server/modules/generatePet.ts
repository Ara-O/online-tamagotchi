
import { OpenAI } from "langchain/llms/openai";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { TimeWeightedVectorStoreRetriever } from "langchain/retrievers/time_weighted";
import {
    GenerativeAgentMemory,
    GenerativeAgent,
} from "langchain/experimental/generative_agents";
import 'dotenv/config'


export async function generatePetPersonality(id: string, name: string, age: number) {
    const userName = "USER";

    const API_KEY = process.env.OPENAI_API_KEY
    const llm = new OpenAI({
        temperature: 0.9,
        openAIApiKey: API_KEY,
        maxTokens: 1500,
    });

    //Generate trait and store in database

    const Simulation = async () => {
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
            traits: "tamagotchi pet, feels hungry, feels the need to bath, feels human emotions",
            status: "a human's pet",
        });

        console.log("Tommie's first summary:\n", await pet.getSummary());
    }


    const runSimulation = async () => {
        try {
            await Simulation();
        } catch (error) {
            console.log("error running simulation:", error);
            throw error;
        }
    };

    await runSimulation();

}

// const Simulation = async () => {


//     const createNewMemoryRetriever = async () => {
//         const vectorStore = new MemoryVectorStore(new OpenAIEmbeddings());
//         const retriever = new TimeWeightedVectorStoreRetriever({
//             vectorStore,
//             otherScoreKeys: ["importance"],
//             k: 15,
//         });
//         return retriever;
//     };

// Initializing Tommie
// const tommiesMemory: GenerativeAgentMemory = new GenerativeAgentMemory(
//     llm,
//     await createNewMemoryRetriever(),
//     { reflectionThreshold: 8 }
// );

// const tommie: GenerativeAgent = new GenerativeAgent(llm, tommiesMemory, {
//     name: "Tommie",
//     age: 25,
//     traits: "anxious, likes design, talkative",
//     status: "looking for a job",
// });

// console.log("Tommie's first summary:\n", await tommie.getSummary());

// //Memories
// const tommieObservations = [
//     "Tommie remembers his dog, Bruno, from when he was a kid",
//     "Tommie feels tired from driving so far",
//     "Tommie sees the new home",
//     "The new neighbors have a cat",
//     "The road is noisy at night",
//     "Tommie is hungry",
//     "Tommie tries to get some rest.",
// ];

// for (const observation of tommieObservations) {
//     await tommie.addMemory(observation, new Date());
// }

// // Checking Tommie's summary again after giving him some memories
// console.log(
//     "Tommie's second summary:\n",
//     await tommie.getSummary({ forceRefresh: true })
// );

// const interviewAgent = async (
//     agent: GenerativeAgent,
//     message: string
// ): Promise<string> => {
//     const newMessage = `${userName} says ${message}`;
//     const response = await agent.generateDialogueResponse(newMessage);
//     return response[1];
// };

// // Let's have Tommie start going through a day in his life.
// const observations = [
//     "Tommie wakes up to the sound of a noisy construction site outside his window.",
//     "Tommie gets out of bed and heads to the kitchen to make himself some coffee.",
//     // "Tommie realizes he forgot to buy coffee filters and starts rummaging through his moving boxes to find some.",
//     // "Tommie finally finds the filters and makes himself a cup of coffee.",
//     // "The coffee tastes bitter, and Tommie regrets not buying a better brand.",
//     // "Tommie checks his email and sees that he has no job offers yet.",
//     // "Tommie spends some time updating his resume and cover letter.",
//     // "Tommie heads out to explore the city and look for job openings.",
//     // "Tommie sees a sign for a job fair and decides to attend.",
//     // "The line to get in is long, and Tommie has to wait for an hour.",
//     // "Tommie meets several potential employers at the job fair but doesn't receive any offers.",
//     // "Tommie leaves the job fair feeling disappointed.",
//     // "Tommie stops by a local diner to grab some lunch.",
//     // "The service is slow, and Tommie has to wait for 30 minutes to get his food.",
//     // "Tommie overhears a conversation at the next table about a job opening.",
//     // "Tommie asks the diners about the job opening and gets some information about the company.",
//     // "Tommie decides to apply for the job and sends his resume and cover letter.",
//     // "Tommie continues his search for job openings and drops off his resume at several local businesses.",
//     // "Tommie takes a break from his job search to go for a walk in a nearby park.",
//     // "A dog approaches and licks Tommie's feet, and he pets it for a few minutes.",
//     // "Tommie sees a group of people playing frisbee and decides to join in.",
//     // "Tommie has fun playing frisbee but gets hit in the face with the frisbee and hurts his nose.",
//     // "Tommie goes back to his apartment to rest for a bit.",
//     // "A raccoon tore open the trash bag outside his apartment, and the garbage is all over the floor.",
//     // "Tommie starts to feel frustrated with his job search.",
//     // "Tommie calls his best friend to vent about his struggles.",
//     // "Tommie's friend offers some words of encouragement and tells him to keep trying.",
//     // "Tommie feels slightly better after talking to his friend.",
// ];

// // Let's send Tommie on his way. We'll check in on his summary every few observations to watch him evolve
// for (let i = 0; i < observations.length; i += 1) {
//     const observation = observations[i];
//     const [, reaction] = await tommie.generateReaction(observation);
//     console.log("\x1b[32m", observation, "\x1b[0m", reaction);
//     if ((i + 1) % 20 === 0) {
//         console.log("*".repeat(40));
//         console.log(
//             "\x1b[34m",
//             `After ${i + 1
//             } observations, Tommie's summary is:\n${await tommie.getSummary({
//                 forceRefresh: true,
//             })}`,
//             "\x1b[0m"
//         );
//         console.log("*".repeat(40));
//     }
// }

// // How to interview

// console.log(
//     await interviewAgent(tommie, "Tell me about how your day has been going, and at the end, give me a scale of how hungry, happy, and sad you are on a scale of 1 - 10 ( 10 being most ), give it in the format of an array of objects")
// );
//     // /*


//     //Setting up second summary

//     // console.log(
//     //     "Tommie's second summary:\n",
//     //     await tommie.getSummary({ forceRefresh: true })
//     // );
// };

// const runSimulation = async () => {
//     try {
//         await Simulation();
//     } catch (error) {
//         console.log("error running simulation:", error);
//         throw error;
//     }
// };

// await runSimulation();