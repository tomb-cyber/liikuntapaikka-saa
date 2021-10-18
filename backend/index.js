const express = require('express')
const app = express()
const cors = require('cors')
app.use(cors())


app.get('/api', (req, res) => {
    const testData = ['testi', 'viesteja', 'backendilta']
    res.send(testData)
  })
  
  
const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })