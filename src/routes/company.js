const router = require("express").Router();
const passport = require("passport");
const companyController = require("../controllers/company");

const passportJWT = passport.authenticate("jwt", {
    failureRedirect: "/auth/login",
    session: false,
});

router.post("/register", companyController.register);
router.get("/register", (req, res) => {
    res.render("register-company");
});
router.get("/me", passportJWT, companyController.getCompanyInfo);

module.exports = router;
