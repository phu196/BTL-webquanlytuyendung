const User = require("../models/User");
const crypto = require("crypto");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");
const { listeners } = require("../models/Company");
// Lấy thông tin người dùng
const getUpdate = async (req, res) => {
    try {
        // Kiểm tra ID người dùng từ token
        const userId = req.user._id;

        if (!userId) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "User ID is not provided" });
        }

        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });
        }
        res.render("updateProfile", { user });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Server error", error: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
        // Lấy userId từ req.body hoặc req.params (nếu không có xác thực JWT)
        const userId = req.user._id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });
        }

        if (req.body.password) {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            req.body.password = hashedPassword;
        }

        // Cập nhật thông tin người dùng
        const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });
        if (!updatedUser) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });
        }

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
const generateUniqueTitle = (title, existingTitles) => {
    let baseTitle = title.replace(/(\(\d+\))?(\.pdf)$/i, ""); // Loại bỏ phần (x) nếu có
    let extension = ".pdf";
    let newTitle = title;
    let counter = 1;

    while (existingTitles.includes(newTitle)) {
        newTitle = `${baseTitle} (${counter})${extension}`;
        counter++;
    }

    return newTitle;
};
const uploadCV = async (req, res) => {
    console.log(req.file);
    try {
        if (!req.user) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: "Unauthorized",
            });
        }
        if (!req.file) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "No file uploaded",
            });
        }

        const userId = req.user._id;
        let title = req.file.originalname;

        // Cập nhật CV vào cơ sở dữ liệu
        const user = await User.findById(userId);
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "User not found",
            });
        }

        // Tạo tiêu đề duy nhất cho CV
        const existingTitles = user.CV.map((cv) => cv.title);
        title = generateUniqueTitle(title, existingTitles);

        // Tạo tên file ngẫu nhiên
        const randomFileName = crypto.randomBytes(16).toString("hex");
        const filePath = path.join(__dirname, `../../uploads/${userId}/cv`, `${randomFileName}.pdf`);

        // Tạo thư mục nếu chưa tồn tại
        const uploadDir = path.dirname(filePath);
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Lưu file lên server
        fs.writeFileSync(filePath, req.file.buffer);

        user.CV.push({ title, path: filePath });
        await user.save();

        return res.status(StatusCodes.OK).json({
            success: true,
            message: "CV uploaded successfully",
            cv: { title, path: filePath },
        });
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Error uploading CV",
        });
    }
};

module.exports = {
    getUpdate,
    updateUser,
    uploadCV,
};
