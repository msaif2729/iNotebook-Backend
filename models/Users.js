const mongoose = require("mongoose");
const {Schema} = mongoose
userscheme = new Schema(
    {
        name :{
            type : String,
            required : true
        },
        uname : {
            type : String,
            required : true,
            unique : true
        },
        pass:{
            type : String,
            required : true,
            unique:true
        },
        date:{
            type : Date,
            default:Date.now
        }
    },{ versionKey: false },{collection : "items"}
)
module.exports = mongoose.model("User",userscheme);