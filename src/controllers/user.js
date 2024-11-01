const User = require("../models/User");
const bcrypt = require("bcrypt");

const { StatusCodes } = require("http-status-codes");

const getUserInfo = async (req, res) => {
    res.json({ success: true, message: "User found" });
};

module.exports = { getUserInfo };
