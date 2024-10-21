const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
    const { username, fullname, email, password } = req.body;
    const user = await User.findOne({ username });
    if (user) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: "Username already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
        username,
        fullname,
        email,
        password: hashedPassword,
    });
    await newUser.save();
    res.status(StatusCodes.CREATED).json({
        success: true,
        message: "User created",
    });
};

const login = async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: "Invalid credentials" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: "Invalid credentials" });
    }
    const payload = { id: user._id, username: user.username };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });
    res.cookie("token", token, {
        httpOnly: true,
        maxAge: 3600000,
        secure: true,
    });
    res.redirect("/user/me");
};

module.exports = { register, login };
