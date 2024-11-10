const express = require('express')
const router = express.Router()


const jobITcontroller = require("../../controllers/jobIT")

router.get("/", jobITcontroller.index)

module.exports = router