import { ObjectId } from "mongodb"
import { getDatabaseConnection } from "../database"

export async function requiresPetAuth(req, res, next) {
    const db = getDatabaseConnection()
    const id = req.body.id

    if (!req.body.id) {
        res.status(400).send({ message: "Invalid request" })
        return
    }

    let doc = await db.collection("pets")
    let pet = await doc.findOne({ "_id": new ObjectId(id) })

    if (pet === null) {
        res.status(404).send({ message: "Pet not found" })
        return
    }

    req.id = id
    req.pet = pet

    next()

}
