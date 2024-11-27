const router = require("express").Router();
const jwt = require("jsonwebtoken");

const authController = require("../controllers/auth");

router.get("/register", (req, res) => {
    const token = req.cookies.session;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.render("register", { title: "Register" });
            }
            return res.redirect("/");
        });
    } else {
        res.render("register", { title: "Register" });
    }
});

router.post("/register", authController.register);

router.get("/login", (req, res) => {
    const token = req.cookies.session;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.render("login", { title: "Login" });
            }
            return res.redirect("/");
        });
    } else {
        res.render("login", { title: "Login" });
    }
});
router.post("/login", authController.login);

router.get("/logout", authController.logout);

router.get("/is-logged-in", authController.isLoggedIn);

module.exports = router;
