const router = require("express").Router();
const passport = require("passport");

const passportJWT = passport.authenticate("jwt-admin", {
    failureRedirect: "/auth/login",
    session: false,
});
router.get("/statistics", passportJWT, (req, res) => {
    res.render("admin/statistics");
});
router.get("/users", passportJWT, (req, res) => {
    res.render("admin/users");
});
router.get("/companies", passportJWT, (req, res) => {
    res.render("admin/companies");
});
router.get("/registrations", passportJWT, (req, res) => {
    res.render("admin/registrations");
});
router.get("/feedbacks", passportJWT, (req, res) => {
    res.render("admin/feedbacks");
});
router.get("/", passportJWT, (req, res) => {
    res.render("admin/index");
});

module.exports = router;
