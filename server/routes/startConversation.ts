import { getDatabaseConnection } from "../database"
import { generatePetPersonality } from "../modules/generatePet"
import { performAction } from "../modules/performAction"

async function loadMemories(db, id) {
    try {
        //Check if the pet already has a personality

    } catch (err) {
        console.error(err)
    }
}
export default async function startConversation(req, res) {

    const db = getDatabaseConnection()

    try {
        const { id, pet } = req
        const { memory } = req.body
        const doc = await db.collection("history")
        const history = await doc.findOne({ "id": id })
        const action = history === null ? "CREATE" : "VISIT"

        if (req.body.memory === "enabled") {
            await loadMemories(db, id)
        }

        let response = await performAction(id, pet?.name, pet?.age, action, memory)

        return res.status(200).send(response)
    } catch (err) {
        res.status(500).send({ message: "There was an error", error: err })
    }
}