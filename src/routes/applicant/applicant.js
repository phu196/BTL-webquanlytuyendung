const express = require('express');
const router = express.Router();
const applicantController = require('../../controllers/applicant/applicant_controller');

router.get("/",applicantController.index);
router.get("/changeInfo",applicantController.changeInfo);
module.exports = router;