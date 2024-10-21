const router = require("express").Router();

const authController = require("../controllers/auth");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/login", (req, res) => {
    res.render("login", { title: "Login" });
});

module.exports = router;
