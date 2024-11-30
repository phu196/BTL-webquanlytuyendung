"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;  // Add this line

const ChatSchema = new mongoose.Schema(
    {
      senderType: {
        type: String,
        enum: ['User', 'Company'], // Chỉ cho phép 2 loại sender
        required: true,
      },
      userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        index: true,
      },
      companyID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        index: true,
      },
      content: {
        type: String,
        required: [true, "Content is not provided"],
      },
      roomID: {
        type: String,
        required: [true, "Room id is not provided"],
        index: true,
      }
    },
    { timestamps: true }
  );
  
  const Chat = mongoose.model("Chat", ChatSchema);
  module.exports = Chat;
  