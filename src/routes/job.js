const express = require("express");
const router = express.Router();

const jobController = require("../controllers/job");

router.get("/viec-lam-it", jobController.searchJob);

router.get("/:id", jobController.showJob);

module.exports = router;
