const express = require("express")
const app = express()
const cors = require("cors")

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.post('/api/createPet', function (req, res) {
    console.log(req.body)
    res.send('Hello World')
})

app.listen(8080)