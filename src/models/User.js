"use strict";
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            require: [true, "Username is not provided"],
            unique: true,
        },
        fullname: {
            type: String,
            require: [true, "Fullname is not provided"],
        },
        role: {
            type: String,
            enum: ["user", "company"],
            default: "user",
        },
        gender: {
            type: String,
            enum: ["male", "female", "other"],
        },
        email: {
            type: String,
            require: [true, "Email is not provided"],
            unique: true,
        },
        password: {
            type: String,
            require: [true, "Password is not provided"],
        },
        refreshToken: {
            type: String,
        },
        phoneNumber: {
            type: String,
        },
        address: {
            detail: String,
            ward: String,
            district: String,
            province: String,
        },
    },
    { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
const User = mongoose.model("User", UserSchema);

module.exports = User;
