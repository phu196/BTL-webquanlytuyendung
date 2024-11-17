const User = require("../models/User");
const mongoose = require("mongoose");
const { StatusCodes } = require("http-status-codes");

// Lấy thông tin người dùng
const getUserInfo = async (req, res) => {
    try {
        // Kiểm tra ID người dùng từ token
        const userId = req.user._id; // Sử dụng req.params.id nếu không có req.user

        if (!userId) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "User ID is not provided" });
        }

        const user = await User.findById(userId).select("-password");
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
        if (req.user) {
            const userId = req.user._id;
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
        } else {
            res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Error updating user information",
            error: error.message,
        });
    }
};

const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.user._id;
        if (!userId) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "User ID is not provided" });
        }
        const user = await User.findById(userId).populate("appliedJobs");
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });
        }
        res.render("user/appliedJob.ejs", { jobs: user.appliedJobs, user : user });
    }
    catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Error getting applied jobs",
            error: error.message,
        });
}
}

module.exports = {
    getUserInfo,
    updateUser,
    getAppliedJobs,
};
