const express = require("express");
const router = express.Router();

const jobController = require("../controllers/job");

router.get("/", jobController.searchJob);
router.post('/apply/:jobId', jobController.applyToJob);
module.exports = router;
