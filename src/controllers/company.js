const Company = require("../models/Company");
const bcrypt = require("bcrypt");

const { StatusCodes } = require("http-status-codes");

const getCompanyInfo = async (req, res) => {
    res.json({ success: true, message: "Company found" });
};

module.exports = { getCompanyInfo };
