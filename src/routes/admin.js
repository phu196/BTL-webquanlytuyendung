const router = require("express").Router();
const passport = require("passport");

const adminController = require("../controllers/admin");

const passportJWT = passport.authenticate("jwt-admin", {
    failureRedirect: "/404",
    session: false,
});
router.get("/statistics", passportJWT, adminController.getStatistics);

router.get("/users", passportJWT, adminController.getUsers);
router.post("/users/delete", passportJWT, adminController.deleteUser);
router.get("/users/add", passportJWT, (req, res) => {
    res.render("admin/addUser");
});
router.post("/users/add", passportJWT, adminController.addUser);

router.get("/companies", passportJWT, adminController.getCompanies);
router.post("/companies/delete", passportJWT, adminController.deleteCompany);
router.get("/companies/add", passportJWT, (req, res) => {
    res.render("admin/addCompany");
});
router.post("/companies/add", passportJWT, adminController.addCompany);

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
