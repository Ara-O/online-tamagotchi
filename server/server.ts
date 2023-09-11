import { Collection, ObjectId } from "mongodb";
import { generatePetPersonality } from "./modules/generatePet";
import { visitPet } from "./modules/visitPet";

const express = require('express');
const cors = require("cors")
const helmet = require("helmet")
const app = express();
const {
    startDatabase,
    closeDatabase,
    getDatabaseConnection,
} = require('./database');


const port = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use(helmet())

async function startServer() {
    try {
        await startDatabase();
        const db = getDatabaseConnection()

        app.post("/api/createPet", async (req, res) => {
            try {
                if (!req.body.petName) {
                    req.body.petName = "Bobby"
                }

                let sanitizedPetName = req.body.petName.trim()
                let collection: Collection = db.collection("pets")

                let doc = await collection.insertOne({
                    name: sanitizedPetName,
                    age: 0,
                    created: Date.now()
                })

                res.status(200).send({ message: "Pet successfully created", id: doc.insertedId })

            } catch (err) {
                res.status(400).send({ message: "Error creating pet" })
            }
        })

        app.post("/api/startConversation", async (req, res) => {
            try {
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

                //Check if the pet already has a personality
                doc = await db.collection("history")
                const history = await doc.findOne({ "id": id })


                if (history === null) {
                    await generatePetPersonality(id, pet?.name, pet?.age)
                    return res.status(200).send({ message: `${pet.name} is happy to see you!` })
                } else {
                    await visitPet(id, pet?.name, pet?.age)
                    console.log("Pet already has personality")
                    return res.status(200).send({ message: `${pet.name} is happy to see you again!` })
                }

            } catch (err) {
                res.status(500).send({ message: "There was an error starting a conversation" })
            }
        })

        // Start the server
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });

    } catch (error) {
        console.error('Error starting the server:', error);
        process.exit(1);
    }
}

startServer();

process.on('SIGINT', () => {
    closeDatabase().then(() => {
        console.log('Database connection closed.');
        process.exit(0);
    });
});