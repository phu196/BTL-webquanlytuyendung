const express = require('express');
const router = express.Router();
const companyController = require('../../controllers/company/company_controller');

// router.get("/setup",companyController.changeInfo);
// router.post("/setup",companyController.postChangeInfo);
// router.get("/:id",companyController.companyDetail);
// router.get("/:id/edit",companyController.editCompany);
// router.post("/:id/edit",companyController.postEditCompany);
router.get("/:id/posts",companyController.companyJobs);
router.post("/:id/posts",companyController.postCompanyJobs);
router.get("/:id/company_page",companyController.companyDetail);
router.delete("/:id/delete-job/:job_id",companyController.deleteJob);
router.get("/:id/view-candidate/:job_id",companyController.viewCandidates);
// router.get("/:id/posts/:job_id",companyController.jobDetail);
// router.get("/:id/posts/:job_id/edit",companyController.editJobDetail);
// router.post("/:id/posts/:job_id/edit",companyController.postJobDetail);
router.get("/",companyController.index);
module.exports = router;

