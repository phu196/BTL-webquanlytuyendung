"use strict";
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Username is not provided"],
            unique: true,
            index: true,
        },
        fullname: {
            type: String,
            required: [true, "Fullname is not provided"],
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
            required: [true, "Email is not provided"],
            unique: true,
            index: true,
        },
        password: {
            type: String,
            required: [true, "Password is not provided"],
        },
        phoneNumber: String,
        address: {
            detail: String,
            ward: String,
            district: String,
            province: String,
        },
        CV: [
            {
                title: String,
                path: String, // path on server
            },
        ],
        jobs: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Job",
            },
        ],
    },
    { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
