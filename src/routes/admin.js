const router = require("express").Router();
const passport = require("passport");

const passportJWT = passport.authenticate("jwt-admin", {
    failureRedirect: "/auth/login",
    session: false,
});

router.get("/", passportJWT, (req, res) => {
    res.render("admin/index");
});

module.exports = router;
