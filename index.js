const connectMongoDB = require('./db')
const path = require('path')

connectMongoDB();

const express = require('express')
const app = express()
const port = 5000

app.use(express.json())

app.use('/api/auth/', require('./routes/auth.js'))
app.use('/api/notes', require('./routes/notes.js'))

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})