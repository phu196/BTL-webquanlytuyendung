const express = require("express");
const router = express.Router();
const passport = require("passport");
const passport = require("passport");

const jobController = require("../controllers/job");

const passportJWT = passport.authenticate("jwt", {
    failureRedirect: "/auth/login",
    session: false,
});

const passportJWT = passport.authenticate("jwt", {
    failureRedirect: "/auth/login",
    session: false,
});

router.get("/viec-lam-it", jobController.searchJob);

router.get("/:jobId", jobController.showJob);

router.get("/:jobId/apply", passportJWT, jobController.applyJob);

router.post("/:jobId/apply", passportJWT, jobController.applyJob);

module.exports = router;
