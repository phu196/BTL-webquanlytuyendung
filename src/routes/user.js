const express = require('express');
const router = express.Router();
const passport = require("passport");
const { getUserInfo, updateUser,getUserProfileForCompany } = require('../controllers/user');
const passportJWT = passport.authenticate("jwt", {
    failureRedirect: "/auth/login",
    session: false,
});

// Hiển thị thông tin User từ góc nhìn Company
router.get('/company/profile',passportJWT, getUserProfileForCompany);
// Get Profile Page
router.get('/profile',passportJWT, getUserInfo);


// Get Update Profile Page
router.get('/profile/update',passportJWT, updateUser);

// Update User Info
router.post('/profile/update',passportJWT, updateUser);

module.exports = router;
