const CompanyRegistration = require("../models/CompanyRegistration");
const Company = require("../models/Company");
const User = require("../models/User");
const getCompanyRegistrations = async (req, res) => {
    try {
        const companyRegistrations = await CompanyRegistration.find({ status: "pending" });
        res.render("admin/registrations", { companyRegistrations });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
const deleteCompanyRegistration = async (req, res) => {
    try {
        const { id } = req.body;
        await CompanyRegistration.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Company registration deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
const approveCompanyRegistration = async (req, res) => {
    try {
        const { id } = req.body;
        await CompanyRegistration.findByIdAndUpdate(id, { status: "approved" });
        res.status(200).json({ success: true, message: "Company registration approved successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getCompanies = async (req, res) => {
    try {
        const companies = await Company.find({});
        res.render("admin/companies", { companies });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteCompany = async (req, res) => {
    try {
        const { id } = req.body;
        await Company.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Company deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const addCompany = async (req, res) => {
    try {
        console.log("Feature in development");
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.render("admin/users", { users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
const deleteUser = async (req, res) => {
    try {
        const { id } = req.body;
        await User.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
module.exports = {
    getCompanyRegistrations,
    deleteCompanyRegistration,
    approveCompanyRegistration,
    getCompanies,
    deleteCompany,
    addCompany,
    getUsers,
    deleteUser,
};
