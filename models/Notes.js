const mongoose = require("mongoose");
const {Schema} = mongoose;
notescheme = new Schema(
    {
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"users"
        },
        title :{
            type : String,
            required : true
        },
        desc : {
            type : String,
            required : true,
        },
        date:{
            type : Date,
            required : true,
            default : Date.now
        },
        tag:{
            type : String,
            default : "General"
        }
    },{ versionKey: false },{collection : "notes"})

module.exports = mongoose.model("Notes",notescheme);