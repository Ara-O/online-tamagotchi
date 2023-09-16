import { Collection, ObjectId } from "mongodb";
import { generatePetPersonality } from "./modules/generatePet";
import { performAction } from "./modules/performAction";
import { requiresPetAuth } from "./auth/auth";
import parseAction from "./modules/parseAction";
import { default as createPetRoute } from "./routes/createPet";
import { default as startConversationRoute } from "./routes/startConversation";

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

        app.post("/api/createPet", createPetRoute)

        app.post("/api/startConversation", requiresPetAuth, startConversationRoute)

        app.post("/api/performAction", requiresPetAuth, async (req, res) => {
            if (!req.body.action || req.body?.action.trim() === "") {
                return res.status(400).send({ message: "There was an error performing this action" })
            }

            try {
                //Gets the id and pet data from the auth
                const { id, pet } = req

                let action;

                //Parse action texts, hug, feed etc
                if (req.body.action === "ACT" && req.body.actionText) {
                    action = parseAction(req.body.action, req.body.actionText)
                } else {
                    action = parseAction(req.body.action)
                }

                console.log("ACTION:", action)

                let response = await performAction(id, pet?.name, pet?.age, action, req.body.actionText)

                console.log("RESPONSE: ", response, "\n")

                return res.status(200).send(response)
            } catch (err) {
                console.log('Error')
                return res.status(404).send(err)
            }
        })

        app.get("/health", (req, res) => {
            return res.send("Helthi")
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