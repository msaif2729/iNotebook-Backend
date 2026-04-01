const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const mongoUri = process.env.MONGO_URI;

const connectMongoDB = () => {
    mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB")
}

module.exports = connectMongoDB;