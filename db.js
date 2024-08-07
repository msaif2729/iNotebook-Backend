const mongoose = require('mongoose');
const mongodburi = "mongodb://localhost:27017/Users"
const { Schema,model } = mongoose;

const connectMongoDB = ()=>{
    mongoose.connect(mongodburi);
    console.log("Connected to MongoDB LocalHost")

    
}

module.exports = connectMongoDB;