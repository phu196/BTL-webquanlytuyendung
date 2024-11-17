const router = require("express").Router();
const passport = require("passport");
const userController = require("../controllers/user");

// Middleware cho JWT authentication (bỏ ra cho route update)
const passportJWT = passport.authenticate("jwt", {
    failureRedirect: "/auth/login", // Redirect đến login nếu không xác thực
    session: false, // Không sử dụng session
});

// Route lấy thông tin người dùng (có xác thực)
router.get("/update", passportJWT, userController.getUpdate);

// Route cập nhật thông tin người dùng (không cần xác thực JWT)
router.post("/update", passportJWT, userController.updateUser);

module.exports = router;
