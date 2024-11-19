"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;  // Add this line

const UserSchema = new Schema(
    {
        username: {
            type: String,
            required: [true, "Username is not provided"],
            unique: true,
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
        },
        password: {
            type: String,
            required: [true, "Password is not provided"],
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
        appliedJobs: [{ type: Schema.Types.ObjectId, ref: 'Job' }]  // Reference to the Job model
    },
    { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
