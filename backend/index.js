const express = require('express')
const app = express()   //app kannattaa laittaa omaan app.js tiedostoon, jos controllerit/routterit/middlewaret lisääntyy
const cors = require('cors')
app.use(cors())


const liikuntapaikkaRouter = require('./controllers/liikuntapaikat')
app.use('/liikuntapaikat', liikuntapaikkaRouter)


//Konventio kai on laittaa sivukohtaiset pyynnöt omiin tiedostoihin, 'controllers' kansioon.
//Tämä nyt alkuun...
app.get('/api', (req, res) => {
    const testData = ['testi', 'viesteja', 'backendilta']
    res.send(testData)
})


//Portteja ja tietokantojen osoitteita kannattaa ymmärtääkseni laittaa .env tiedostoon, sitten kun niin pitkälle päästään...
const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})