const express = require('express')
const router = express.Router()

const CompanyController = require('../../controllers/company/company_controller');

router.get('/:id/edit', CompanyController.edit);
router.post('/:id/update', CompanyController.postEditCompany);


module.exports = router;