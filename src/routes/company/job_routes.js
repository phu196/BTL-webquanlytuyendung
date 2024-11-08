const express = require('express')
const router = express.Router()

const JobController = require('../../controllers/job_controller');


// thông tin job cụ thể của công ty
router.get('/:id/edit', JobController.editJob);
router.post('/:id/update', JobController.postEditJob); 

module.exports = router;