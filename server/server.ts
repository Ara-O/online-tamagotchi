import { Collection } from "mongodb";

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

                let collection: Collection = db.collection("pets")

                let doc = await collection.insertOne({
                    name: req.body.petName,
                    created: Date.now()
                })

                res.status(200).send({ message: "Pet successfully created", id: doc.insertedId })

            } catch (err) {
                res.status(400).send({ message: "Error creating pet" })
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