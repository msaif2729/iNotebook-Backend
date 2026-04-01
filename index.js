require('dotenv').config()
const connectMongoDB = require('./db')
const cors = require('cors')

connectMongoDB();

const express = require('express')
const errorHandler = require('./middleware/errorHandler')
const logs = require('./middleware/logs')

const app = express()
const port = process.env.PORT || 5000

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : ['http://localhost:3000', 'https://inotebook-frontend-ruby.vercel.app'];

app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));
app.use(express.json())
app.use(logs)

app.use('/api/auth', require('./routes/auth.js'))
app.use('/api/notes', require('./routes/notes.js'))

app.use(errorHandler)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})