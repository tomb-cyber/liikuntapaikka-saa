const express = require('express')
const app = express()   //app kannattaa laittaa omaan app.js tiedostoon, jos controllerit/routterit/middlewaret lisääntyy
const cors = require('cors')
app.use(cors())


const liikuntapaikkaRouter = require('./controllers/liikuntapaikat')
app.use('/liikuntapaikat', liikuntapaikkaRouter)


//Portteja ja tietokantojen osoitteita kannattaa ymmärtääkseni laittaa .env tiedostoon, sitten kun niin pitkälle päästään...
const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
