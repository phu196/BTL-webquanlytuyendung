const router = require("express").Router();
const passport = require("passport");
const userController = require("../controllers/user");

const { upload, uploadErrorHandler } = require("../middlewares/upload");

// Middleware cho JWT authentication (bỏ ra cho route update)
const passportJWT = passport.authenticate("jwt", {
    failureRedirect: "/auth/login", // Redirect đến login nếu không xác thực
    session: false,
});

// Route lấy thông tin người dùng (có xác thực)

router.get("/update", passportJWT, userController.getUpdate);

router.get("/information", passportJWT, userController.getUserInfo);

router.post("/update", passportJWT, userController.updateUser);

// Route upload CV
router.post(
    "/upload-cv",
    passportJWT,
    upload.single("cv"),
    uploadErrorHandler, // Xử lý lỗi từ middleware
    userController.uploadCV
);
// Route xem job đang applied
router.get("/applied-jobs", passportJWT, userController.getAppliedJobs);

module.exports = router;
