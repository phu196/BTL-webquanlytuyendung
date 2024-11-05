const router = require("express").Router();
const passport = require("passport");

const adminController = require("../controllers/admin");

const passportJWT = passport.authenticate("jwt-admin", {
    failureRedirect: "/404",
    session: false,
});
router.get("/statistics", passportJWT, (req, res) => {
    res.render("admin/statistics");
});

router.get("/users", passportJWT, adminController.getUsers);
router.post("/users/delete", passportJWT, adminController.deleteUser);

router.get("/companies", passportJWT, adminController.getCompanies);
router.post("/companies/delete", passportJWT, adminController.deleteCompany);

router.get("/registrations", passportJWT, adminController.getCompanyRegistrations);
router.post("/registrations/delete", passportJWT, adminController.deleteCompanyRegistration);
router.post("/registrations/done", passportJWT, adminController.approveCompanyRegistration);

router.get("/feedbacks", passportJWT, (req, res) => {
    res.render("admin/feedbacks");
});

router.get("/", passportJWT, (req, res) => {
    res.render("admin/index");
});

module.exports = router;
