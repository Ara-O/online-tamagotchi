import { Collection } from "mongodb"
import { getDatabaseConnection } from "../database"

export default async function (req, res) {
    const db = getDatabaseConnection()

    try {
        if (!req.body.petName) {
            req.body.petName = "Bobby"
        }

        let sanitizedPetName = req.body.petName.trim()

        let collection: Collection = db.collection("pets")


        // let doc = await collection.insertOne({
        //     name: sanitizedPetName,
        //     age: 0,
        //     created: Date.now()
        // })

        res.status(200).send({ message: "Pet successfully created", id: doc.insertedId })

    } catch (err) {
        res.status(400).send({ message: "Error creating pet" })
    }
}