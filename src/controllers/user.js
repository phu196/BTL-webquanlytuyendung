const User = require("../models/User");
const mongoose = require("mongoose");
const { StatusCodes } = require("http-status-codes");

// Lấy thông tin người dùng
// Lấy thông tin người dùng
const getUserInfo = async (req, res) => {
    try {
        // Kiểm tra ID người dùng từ token
        const userId = req.user ? req.user.id : req.params.id; // Sử dụng req.params.id nếu không có req.user

        if (!userId) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "User ID is not provided" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });
        }
        res.render("profile", { user });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Server error", error: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
        // Lấy userId từ req.body hoặc req.params (nếu không có xác thực JWT)
        const userId = req.body.id || req.params.id;

        if (!userId) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "User ID is not provided" });
        }

        // Kiểm tra và lọc các trường hợp được phép cập nhật
        const allowedFields = ["fullname", "gender", "phoneNumber", "address"];
        const updateData = Object.keys(req.body)
            .filter((key) => allowedFields.includes(key))
            .reduce((obj, key) => {
                obj[key] = req.body[key];
                return obj;
            }, {});

        // Cập nhật người dùng trong cơ sở dữ liệu
        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true });

        if (!updatedUser) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });
        }

        const { password, refreshToken, ...safeUser } = updatedUser._doc;

        res.status(StatusCodes.OK).json({
            message: "User updated successfully",
            user: safeUser,
        });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Error updating user information",
            error: error.message,
        });
    }
};

const createInfo = async(req, res) =>{
    try{
        const userId = req.body.id || req.params.id 

        if (!userId) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "User ID is not provided" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });
        }
        res.render("UserInfoSetup", { user });


    }
    catch(error){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Error updating user information",
            error: error.message,
        });
    }
};

const createdInfo = async (req, res) => {
    try {
        const userId = req.params.id || req.body.id;

        const address = {
            detail: req.body["address.detail"],
            ward: req.body["address.ward"],
            district: req.body["address.district"],
            province: req.body["address.province"],
        };

        // Kiểm tra file đã được upload hay chưa
        const avatarPath = req.file ? `/images/${req.file.filename}` : undefined;


        // Đối tượng cập nhật
        const updateData = {
            username: req.body.username,
            fullname: req.body.fullname,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            gender: req.body.gender,
            address: address,
        };

        // Thêm avatarPath vào nếu có
        if (avatarPath) {
            updateData.avatarPath = avatarPath;
        }

        // Cập nhật user trong cơ sở dữ liệu
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }

        res.redirect("/");
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, message: error.message });
    }
};

module.exports = {
    getUserInfo,
    updateUser,
    createInfo,
    createdInfo,
};
