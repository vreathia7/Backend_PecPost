const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true
    },

    lastName:{
        type: String
    },

    username:{
        type: String,
        required: true,
        unique: true,
        min: 5,
        max: 30
    },

    password:{
        type: String,
        required: true,
        min: 5
    },

    email:{
        type: String,
        required: true,
        unique: true
    },

    

}) 