require("dotenv").config({ path: ".env.example" });
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Company = require("../models/Company");
const transporter = require("../services/nodemailer");
const ejs = require('ejs');
const fs = require('fs');

const register = async (req, res) => {
    const { username, fullname, email, password, phoneNumber } = req.body;
    // validate
    if (!username || !fullname || !email || !password || !phoneNumber) {
        return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "Please fill in all fields" });
    }
    // check phoneNumber
    const phoneNumberRegex = /^\d{10}$/;
    if (!phoneNumberRegex.test(phoneNumber)) {
        return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "Invalid phoneNumber number" });
    }
    // check email
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
        return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "Invalid email" });
    }
    const user = await User.findOne({ username });
    if (user) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: "Username already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
        username,
        fullname,
        email,
        phoneNumber,
        password: hashedPassword,
    });
    await newUser.save();
    res.status(StatusCodes.CREATED).json({
        success: true,
        message: "User created",
    });
};

const login = async (req, res) => {
    const { username, password, loginAs } = req.body;
    if (!loginAs || (loginAs !== "user" && loginAs !== "company")) {
        res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: "Invalid login type",
        });
    }
    if (loginAs == "user") {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: "Invalid credentials" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid credentials" });
        }
        const payload = { id: user._id, identify: "user" };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "3h",
        });
        res.status(StatusCodes.OK).cookie("session", token).json({ success: true });
    } else if (loginAs == "company") {
        const company = await Company.findOne({ email: username });
        if (!company) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, company.password);
        if (!isPasswordValid) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: "Invalid credentials" });
        }
        const payload = { id: company._id, identify: "company" };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "3h",
        });
        res.status(StatusCodes.OK).cookie("session", token).json({ success: true });
    }
};

const isLoggedIn = async (req, res) => {
    const token = req.cookies.session;
    if (!token) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: "Unauthorized" });
    }
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        if (payload.id) {
            if (payload.identify === "user") {
                const user = await User.findById(payload.id).select("-password");
                if (user) return res.status(StatusCodes.OK).json({ success: true, user, identify: "user" });
                else return res.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: "Unauthorized" });
            } else if (payload.identify === "company") {
                const company = await Company.findById(payload.id).select("-password");
                if (company) return res.status(StatusCodes.OK).json({ success: true, company, identify: "company" });
                else return res.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: "Unauthorized" });
            }
        } else {
            return res.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: "Unauthorized" });
        }
    } catch (error) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: "Unauthorized" });
    }
};

const logout = async (req, res) => {
    res.clearCookie("session").redirect("/");
}

const forgotPassword = async (req, res) => {
    const { identifier } = req.body;
    if (!identifier) {
        return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "Please fill in all fields" });
    }
    const user = await User.findOne({ $or: [{ email: identifier }, { username: identifier }] });
    const company = await Company.findOne({ email: identifier });
    if (!user && !company) {
        return res.status(StatusCodes.OK).json({ success: true, message: null });
    }
    const email = user ? user.email : company.email;

    resetToken = jwt.sign({ id: user ? user._id : company._id, type: user ? 'user' : 'company' }, process.env.JWT_SECRET, {
        expiresIn: "1h"
    });

    const htmlContent = ejs.render(fs.readFileSync("src/views/emails/reset-password.ejs", "utf8"), {
        userName: user ? user.fullname : company.companyName,
        resetLink: `${process.env.CLIENT_URL}/auth/reset-password/?token=${resetToken}`,
    });
    const mailOptions = {
        from: process.env.USER_GMAIL,
        to: email,
        subject: "Reset your password",
        html: htmlContent,
    }
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).json({ success: false, message: error.message });
        } else {
            console.log("Email sent: " + info.response);
            res.status(200).json({ success: true, message: null });
        }
    });
};

const resetPassword = async (req, res) => {
    try {
        const { token } = req.body;
        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                throw new Error("Invalid token");
            }
            const { id, type } = decoded;
            if (type == 'user') {
                const user = await User.findById(id);
                if (!user) return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "Invalid token" });
                const { newPassword, confirmPassword } = req.body;
                if (newPassword != confirmPassword) return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "Passwords do not match" });
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(newPassword, salt);
                user.password = hashedPassword;
                await user.save();
                return res.status(StatusCodes.OK).json({ success: true, message: "Password reset successfully" });
            } else {
                const company = await Company.findById(id);
                if (!company) return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "Invalid token" });
                const { newPassword, confirmPassword } = req.body;
                if (newPassword != confirmPassword) return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "Passwords do not match" });
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(newPassword, salt);
                company.password = hashedPassword;
                await company.save();
                return res.status(StatusCodes.OK).json({ success: true, message: "Password reset successfully" });
            }
        });
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "Something went wrong" });
    }
};

module.exports = { register, login, isLoggedIn, logout, forgotPassword, resetPassword };
