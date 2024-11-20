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
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn file 5MB
});

// Xử lý lỗi của multer
const uploadErrorHandler = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // Lỗi từ multer
        return res.status(400).json({
            success: false,
            message: `Multer error: ${err.message}`,
        });
    } else if (err) {
        // Lỗi khác
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }
    next();
};

module.exports = { upload, uploadErrorHandler };
