const bcrypt = require("bcrypt");

const CompanyRegistration = require("../models/CompanyRegistration");
const Company = require("../models/Company");
const User = require("../models/User");
const Job = require("../models/Job");
const ejs = require('ejs');
const fs = require('fs');
const transporter = require("../services/nodemailer");
const mongoose = require("mongoose");

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
        const jobs = await Job.find({ companyId: id });
        jobs.forEach(async (job) => {
            await Job.findByIdAndDelete(job._id);
        })
        res.status(200).json({ success: true, message: "Company deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const addCompany = async (req, res) => {
    try {
        const companyInfo = req.body;
        const companyExists = await Company.findOne({ username: companyInfo.email });
        if (companyExists) {
            return res.status(400).json({ success: false, message: "Company already exists" });
        }
        const plainPassword = companyInfo.password;
        const hashPassword = await bcrypt.hash(companyInfo.password, 10);
        companyInfo.password = hashPassword;
        const company = new Company(companyInfo);

        htmlContent = ejs.render(fs.readFileSync("src/views/emails/company-registration.ejs", "utf8"), {
            companyName: companyInfo.companyName,
            email: companyInfo.email,
            password: plainPassword,
        });
        const mailOptions = {
            from: process.env.USER_GMAIL,
            to: companyInfo.email,
            subject: "Thank you for registering your company.",
            html: htmlContent
        };
        transporter.sendMail(mailOptions, async (error, info) => {
            if (error) {
                console.log(error);
                res.status(500).json({ success: false, message: error.message });
            } else {
                await company.save();
                console.log("Email sent: " + info.response);
                res.status(200).json({ success: true, message: "Company added successfully" });
            }
        });
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
        const jobs = await Job.find({ applicants: { $elemMatch: { $eq: new mongoose.Types.ObjectId(id) } } });
        jobs.forEach(async (job) => {
            job.applicants = job.applicants.filter((applicant) => applicant.toString() !== id);
            await job.save();
        });
        return res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const addUser = async (req, res) => {
    try {
        const { username, fullname, email, password, phoneNumber } = req.body;
        const hashPassword = await bcrypt.hash(password, 10);
        const user = new User({
            username,
            fullname,
            email,
            password: hashPassword,
            phoneNumber,
        });
        await user.save();
        return res.status(200).json({ success: true, message: "User added successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const getStatistics = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({});
        const totalCompanies = await Company.countDocuments({});
        const totalRegistrations = await CompanyRegistration.countDocuments({});
        res.render("admin/statistics", { totalUsers, totalCompanies, totalRegistrations });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const getCompanyJobs = async (req, res) => {
    try {
        const { id } = req.params;
        const company = await Company.findById(id);
        const jobs = await Job.find({ companyId: id });
        res.render("admin/companyJobs", { company, jobs });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const deleteJob = async (req, res) => {
    try {
        const { id } = req.body;
        const users = await User.find({ jobs: { $elemMatch: { $eq: new mongoose.Types.ObjectId(id) } } });

        users.forEach(async (user) => {
            user.jobs = user.jobs.filter((job) => job.toString() !== id);
            await user.save();
        });
        await Job.findByIdAndDelete(id);
        return res.status(200).json({ success: true, message: "Job deleted successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: error.message });
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
    addUser,
    getStatistics,
    getCompanyJobs,
    deleteJob
};
