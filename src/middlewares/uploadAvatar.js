const multer = require("multer");
const path = require("path");

// Cấu hình lưu file trên ổ đĩa
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../public/images")); // Thư mục lưu file
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Tạo tên file duy nhất
    },
});

// Middleware Multer
const uploadAvatar = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn file 5MB
    fileFilter: (req, file, cb) => {
        // Các loại file ảnh được phép
        const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true); // File hợp lệ
        } else {
            cb(new Error("Invalid file type. Only JPG, PNG, and GIF files are allowed."), false); // File không hợp lệ
        }
    },
});

// Xử lý lỗi của multer
const uploadAvatarErrorHandler = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // Lỗi từ multer
        return res.status(400).json({
            success: false,
            message: `Multer error: ${err.message}`,
        });
    } else if (err) {
        // Lỗi kiểm tra file
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }
    next();
};

module.exports = { uploadAvatar, uploadAvatarErrorHandler };
