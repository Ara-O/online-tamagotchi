import { Collection, ObjectId } from "mongodb";
import { generatePetPersonality } from "./modules/generatePet";
import { visitPet } from "./modules/visitPet";
import { requiresPetAuth } from "./auth/auth";
import parseAction from "./modules/parseAction";

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

        app.post("/api/startConversation", requiresPetAuth, async (req, res) => {
            try {
                const { id, pet } = req

                //Check if the pet already has a personality
                let doc = await db.collection("history")
                const history = await doc.findOne({ "id": id })

                if (history === null) {
                    await generatePetPersonality(id, pet?.name, pet?.age)
                    return res.status(200).send({ message: `${pet.name} is happy to see you!` })
                } else {
                    let response = await visitPet(id, pet?.name, pet?.age)
                    console.log("You are visiting pet - ", response)
                    return res.status(200).send({ message: response })
                }
            } catch (err) {
                res.status(500).send({ message: "There was an error", error: err })
            }
        })

        app.post("/api/performAction", requiresPetAuth, async (req, res) => {
            if (!req.body.action || req.body?.action.trim() === "") {
                res.status(400).send({ message: "There was an error performing this action" })
            }

            //Gets the id and pet data from the auth
            const { id, pet } = req

            let action;

            if (req.body.action === "ACT" && req.body.actionText) {
                action = parseAction(req.body.action, req.body.actionText)
            } else {
                action = parseAction(req.body.action)
            }

            console.log("ACTION:", action)
            let response = await visitPet(id, pet?.name, pet?.age, action, req.body.actionText)
            console.log(response)
            return res.status(200).send({ message: response })
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