"use strict"
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            require: [true, "Username is not provided"],
            unique: true
        },
        fullname: {
            type: String,
            require: [true, "Fullname is not provided"]
        },
        gender: {
            type: String,
            enum: ["male", "female", "other"]
        },
        email: {
            type: String,
            require: [true, "Email is not provided"],
            unique: true
        },
        password: {
            type: String,
            require: [true, "Password is not provided"]
        },
        refreshToken: {
            type: String
        },
        phone: {
            type: String
        },
        address: {
            detail: String,
            ward: String,
            district: String,
            province: String
        }
    }
)

const User = mongoose.model('User', UserSchema,"users");

module.exports = User;