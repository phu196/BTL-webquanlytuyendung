const multer = require("multer");
const path = require("path");
const fileType = require("file-type");

// Cấu hình lưu file trong bộ nhớ tạm (RAM)
const storage = multer.memoryStorage();

// Hàm validate file
const validateFile = async (file) => {
    const fileExtension = path.extname(file.originalname).toLowerCase();

    // Kiểm tra phần mở rộng
    if (fileExtension !== ".pdf") {
        throw new Error("Invalid file extension. Only .pdf files are allowed.");
    }

    // Kiểm tra signature bit của file
    const detectedType = file.mimetype;
    if (!detectedType || detectedType !== "application/pdf") {
        throw new Error("Invalid file type based on signature. Only PDF files are allowed.");
    }
};

// Middleware Multer với Validate
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn file 5MB
    fileFilter: async (req, file, cb) => {
        try {
            await validateFile(file);
            cb(null, true); // File hợp lệ
        } catch (error) {
            cb(new Error(error.message)); // File không hợp lệ
        }
    },
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
        // Lỗi từ validateFile
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }
    next();
};

module.exports = { upload, uploadErrorHandler };