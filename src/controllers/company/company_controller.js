const User = require('../../models/User');
const Company = require('../../models/Company');
const Job = require('../../models/Job');
const mongoose = require('mongoose');
// [GET] /company/:id
module.exports.index = async(req,res) =>{
    //const id = "6720a18f8213b3da13ecb3a1"
    // const id = req.params.id;
    // console.log(req.params)
    const id = req.query.id;
    try {
        const company = await Company.findById(id).populate('company_job');
        res.render("company/layout/mainpage", {
            company: company
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

//[GET] /comapny/:id/company_page
module.exports.companyDetail = async (req,res) =>{
    const id = req.params.id;
    try {
        const company = await Company.findById(id).populate('company_job');
        res.render("company/layout/company_view", {
            company: company
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}


// [GET] /company/:id/post
module.exports.companyJobs = async (req,res) =>{
    res.render('./company/layout/job_post')
}

// [POST] /company/:id/post
module.exports.postCompanyJobs =async (req,res) =>{
    // console.log(req.body)
    const id = req.params.id;
    const {jobTitle,jobDescription,jobRequirement,jobBenefit,jobLocation,jobDeadline,jobQuantity,jobType,jobTime,jobExperience,jobSkill,jobSalary} = req.body;
    const company = await Company.findById(id);
    const isExit = await Job.findOne({title: jobTitle});
    if (isExit){
        return res.status(400).send('Job already exists');
    }
    else{
    const salary_negotiation = false;
    let skill = [];
if (jobSkill) {
  skill = jobSkill.split(",");
} else {
  console.error("jobSkill is undefined or null");
}
    if (jobSalary !="Thoả thuận"){
        const salary_negotiation = false;
    }
    else {
        const salary_negotiation = true;
    }
    const job = new Job({
        title: jobTitle,
        job_description: jobDescription,
        job_requirement: jobRequirement,
        job_benefit: jobBenefit,
        company_name: company.company_name,
        company_id: company._id,
        region: jobLocation,
        job_experience: jobExperience,
        number_of_recruitment: jobQuantity,
        job_status: true,
        job_time: jobTime,
        type_of_work: jobType,
        skill: skill,
        salary: jobSalary,
        salary_negotiation: salary_negotiation,
        last_date: jobDeadline,
        level:""
    });
    try {
        await job.save();
        company.company_job.push(job);
        await company.save();
        res.redirect(`/company?id=${id}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}
}

// [DELETE] /company/:id/delete-job/:job_id
module.exports.deleteJob = async (req,res) =>{
    const id = req.params.id;
    const job_id = req.params.job_id;
    
    try {
        await Job.findByIdAndDelete(job_id);
        const company = await Company.findById(id);
        if (company) {
            company.company_job.pull(job_id);
            await company.save(); 
        }
    
        res.redirect(`/company?id=${id}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
    
}
// [GET] /company/:id/view-candidates/:job_id
module.exports.viewCandidates = async (req,res) =>{
    const id = req.params.id;
    const job_id = req.params.job_id;
    try{
        const job = await Job.findById(job_id).populate('applicant')
        res.render('./company//layout/view_candidates',{
            job: job
        })
    }
    catch(error){
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}