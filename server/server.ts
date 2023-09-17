import { Collection, ObjectId } from "mongodb";
import { generatePetPersonality } from "./modules/generatePet";
import { performAction } from "./modules/performAction";
import { requiresPetAuth } from "./auth/auth";
import parseAction from "./modules/parseAction";
import { default as createPetRoute } from "./routes/createPet";
import { default as startConversationRoute } from "./routes/startConversation";
import { default as performActionRoute } from "./routes/performAction";

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

        app.post("/api/performAction", requiresPetAuth, performActionRoute)

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