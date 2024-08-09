const mongoose = require('mongoose');
const mongodb_localhost_uri = "mongodb://localhost:27017/iNotebook"
// const mongodb_atlas_uri = "mongodb+srv://saif_user:msaif2729@inotebook.lmsptwt.mongodb.net/inotebook"
const { Schema,model } = mongoose;

const connectMongoDB = ()=>{
    mongoose.connect(mongodb_localhost_uri);
    console.log("Connected to MongoDB LocalHost")

    
}

module.exports = connectMongoDB;