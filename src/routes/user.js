const router = require("express").Router();
const passport = require("passport");
const userController = require("../controllers/user");
const { upload, uploadErrorHandler } = require("../middlewares/uploadAvatar");


// Middleware cho JWT authentication (bỏ ra cho route update)
const passportJWT = passport.authenticate("jwt", {
    failureRedirect: "/auth/login", // Redirect đến login nếu không xác thực
    session: false, // Không sử dụng session
});

// Route lấy thông tin người dùng (có xác thực)
router.get("/:id/edit", userController.getUserInfo);

// Route cập nhật thông tin người dùng (không cần xác thực JWT)
router.post("/update", userController.updateUser);

// Route create thông tin người dùng 
router.get("/:id/create", userController.createInfo);
router.post("/:id/created",upload.single("avatar"),uploadErrorHandler, userController.createdInfo);

module.exports = router;
