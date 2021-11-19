const express = require('express')
const app = express()   //app kannattaa laittaa omaan app.js tiedostoon, jos controllerit/routterit/middlewaret lisääntyy
const cors = require('cors')
const mongoose = require('mongoose')
app.use(cors())
require('dotenv').config()


const liikuntapaikkaRouter = require('./controllers/liikuntapaikat')
app.use('/liikuntapaikat', liikuntapaikkaRouter)

const password = process.env.PASS
const url = `mongodb+srv://liikuntaDBUser:${password}@liikunta.y69b6.mongodb.net/liikuntapaikat?retryWrites=true&w=majority`


mongoose.connect(url)
    .then(() => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connection to MongoDB:' + error.message)
    })


//Portteja ja tietokantojen osoitteita kannattaa ymmärtääkseni laittaa .env tiedostoon, sitten kun niin pitkälle päästään...
const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})