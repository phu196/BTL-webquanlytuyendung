const router = require("express").Router();
const passport = require("passport");
const userController = require("../controllers/user");
const { uploadAvatar, uploadAvatarErrorHandler } = require("../middlewares/uploadAvatar");


const { upload, uploadErrorHandler } = require("../middlewares/upload");

// Middleware cho JWT authentication (bỏ ra cho route update)
const passportJWT = passport.authenticate("jwt", {
    failureRedirect: "/auth/login", // Redirect đến login nếu không xác thực
    session: false,
});
// Route lấy thông tin người dùng (có xác thực)
router.get("/edit", passportJWT, userController.getUserInfo);

router.get("/update", passportJWT, userController.getUpdate);

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

// Route create thông tin người dùng 
router.get("/create", passportJWT, userController.createInfo);
router.post("/created", passportJWT, uploadAvatar.single("avatar"), uploadAvatarErrorHandler, userController.createdInfo);

module.exports = router;
