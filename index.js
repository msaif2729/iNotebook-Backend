const connectMongoDB = require('./db')
const path = require('path')
const cors = require('cors')

connectMongoDB();

const express = require('express')

const app = express()
const port = 5000

app.use(cors({
    origin: ['http://localhost:3000', 'https://inotebook-frontend-ruby.vercel.app'], // Allow multiple origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));
app.use(express.json())

app.use('/api/auth', require('./routes/auth.js'))
app.use('/api/notes', require('./routes/notes.js'))

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})