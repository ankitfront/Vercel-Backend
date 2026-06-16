import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true   
    },
    cartData:{
        type:Object,
        default:{}  // When a new user is created, the cartData will be an empty object by default.
    }
},{minimize:false}) // minimize:false is used to prevent mongoose from removing empty objects from the database.

const userModel = mongoose.models.user || mongoose.model("user",userSchema);

export default userModel;