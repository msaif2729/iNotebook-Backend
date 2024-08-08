const mongoose = require("mongoose");
const {Schema} = mongoose
userscheme = new Schema(
    {
        name :{
            type : String,
            required : true
        },
        email : {
            type : String,
            required : true
        },
        pass:{
            type : String,
            required : true
        },
        date:{
            type : Date,
            default:Date.now
        }
    },{ versionKey: false },{collection : "users"}
)
module.exports = mongoose.model("User",userscheme);