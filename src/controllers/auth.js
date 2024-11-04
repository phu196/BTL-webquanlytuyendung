const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Company = require("../models/Company");

const register = async (req, res) => {
    const { username, fullname, email, password, telephone } = req.body;
    const user = await User.findOne({ username });
    if (user) {
        return res
            .status(StatusCodes.UNAUTHORIZED)
            .json({ success: false, message: "Username already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
        username,
        fullname,
        email,
        telephone,
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
            return res
                .status(StatusCodes.UNAUTHORIZED)
                .json({ success: false, message: "Invalid credentials" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ message: "Invalid credentials" });
        }
        const payload = { userId: user._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "3h",
        });
        res.status(StatusCodes.OK).json({ success: true, token });
    } else if (loginAs == "company") {
        const company = await Company.findOne({ username });
        if (!company) {
            return res
                .status(StatusCodes.UNAUTHORIZED)
                .json({ success: false, message: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            company.password
        );
        if (!isPasswordValid) {
            return res
                .status(StatusCodes.UNAUTHORIZED)
                .json({ success: false, message: "Invalid credentials" });
        }
        const payload = { companyId: company._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "3h",
        });
        res.status(StatusCodes.OK).json({ success: true, token });
    }
};

module.exports = { register, login };
