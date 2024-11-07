const router = require("express").Router();
const passport = require("passport");
const userController = require("../controllers/user");

const passportJWT = passport.authenticate("jwt", {
    failureRedirect: "/auth/login",
    session: false,
});

router.get("/me", passportJWT, userController.getUserInfo);
module.exports = router;
