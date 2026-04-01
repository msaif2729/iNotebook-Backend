require('dotenv').config()
const connectMongoDB = require('./db')
const cors = require('cors')

connectMongoDB();

const express = require('express')
const errorHandler = require('./middleware/errorHandler')
const logs = require('./middleware/logs')

const app = express()
const port = process.env.PORT || 5000



const allowedOrigins = [
  "https://inotebook-msaif2729.vercel.app",
  "http://localhost:3000"
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json())
app.use(logs)

app.use('/api/auth', require('./routes/auth.js'))
app.use('/api/notes', require('./routes/notes.js'))

app.use(errorHandler)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})