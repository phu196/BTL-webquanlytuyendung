const router = require("express").Router();
const passport = require("passport");
const userController = require("../controllers/user");

// Middleware cho JWT authentication (bỏ ra cho route update)
const passportJWT = passport.authenticate("jwt", {
    failureRedirect: "/auth/login", // Redirect đến login nếu không xác thực
    session: false, // Không sử dụng session
});

// Route lấy thông tin người dùng (có xác thực)
<<<<<<< HEAD
router.get("/information",passportJWT, userController.getUserInfo);
=======
router.get("/update", passportJWT, userController.getUpdate);
>>>>>>> ceb915ddea66b6ee22f28282b03fc3c6aa132986

// Route cập nhật thông tin người dùng (không cần xác thực JWT)
router.post("/update", passportJWT, userController.updateUser);

// Route xem job đang applied
router.get("/applied-jobs", passportJWT, userController.getAppliedJobs);

module.exports = router;
