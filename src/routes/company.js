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

router.get("/:id/posts", companyController.companyJobs);

router.get("/profile", passportJWT, companyController.profile);
// Edit company profile
router.get("/edit", passportJWT, companyController.edit);

router.get("/:id", companyController.companyDetail);

router.post("/update", passportJWT, companyController.updateCompany);

router.post("/jobs/create", passportJWT, companyController.createJob);
router.delete("/jobs/:job_id/delete", passportJWT, companyController.deleteJob);
// thông tin job cụ thể của công ty
router.get("/jobs/:job_id/edit", passportJWT, companyController.editJob);
router.post("/jobs/:job_id/update", passportJWT, companyController.postEditJob);

// show cho bản thân công ty xem
router.get("/jobs/:job_id/show", passportJWT, companyController.showJob);
router.get("/jobs/:job_id/view-candidates", passportJWT, companyController.viewCandidates);

module.exports = router;
