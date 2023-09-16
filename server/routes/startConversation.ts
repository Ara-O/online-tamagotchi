import { getDatabaseConnection } from "../database"
import { generatePetPersonality } from "../modules/generatePet"
import { visitPet } from "../modules/visitPet"

async function loadMemories(db, id) {
    try {
        //Check if the pet already has a personality
        const doc = await db.collection("history")

        const history = await doc.findOne({ "id": id })

        const prompt = history === null ? "Your owner just created you" : "Your owner just visited you"
    }
}
export default async function startConversation(req, res) {

    const db = getDatabaseConnection()

    try {
        const { id, pet } = req
        const { memory } = req.body

        //Check if the pet already has a personality
        if (req.body.memory === "enabled") {
            await loadMemories
        }

        // If memory is true, load all memories here, i dont think they are
        //stored in the pet object itself

        // let response = await visitPet(id, pet?.name, pet?.age, prompt, memory)

        // console.log("PET RESPONSE - ", response, "\n")

        // return res.status(200).send(response)
    } catch (err) {
        res.status(500).send({ message: "There was an error", error: err })
    }
}