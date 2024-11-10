const router = require("express").Router();

const authController = require("../controllers/auth");

router.get("/register", (req, res) => {
    res.render("register", { title: "Register" });
});
router.get("/register", (req, res) => {
    res.render("register", { title: "Register" });
});
router.post("/register", authController.register);
router.get("/login", (req, res) => {
    res.render("login", { title: "Login" });
});
router.post("/login", authController.login);

router.get("/is-logged-in", authController.isLoggedIn);

module.exports = router;
