const express = require('express');
const router = express.Router();
const { getUserInfo, updateUser,getUserProfileForCompany } = require('../controllers/user');
// Hiển thị thông tin User từ góc nhìn Company
router.get('/company/profile/:userId', getUserProfileForCompany);
// Get Profile Page
router.get('/:id', getUserInfo);


// Get Update Profile Page
router.get('/:id/update', updateUser);

// Update User Info
router.post('/:id/update', updateUser);

module.exports = router;
