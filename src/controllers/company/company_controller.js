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



// [GET] /company/:id/post
module.exports.companyJobs = async (req,res) =>{
    res.render('./company/layout/job_post')
}

// [POST] /company/:id/post
module.exports.postCompanyJobs =async (req,res) =>{
    console.log(req.body)
    const id = req.params.id;
    const {jobTitle,jobDescription,jobRequirement,jobBenefit,jobLocation,jobDeadline,jobQuantity,jobType,jobExperience,jobSkill,jobSalary} = req.body;
    const company = await Company.findById(id);
    const salary_negotiation = false;
    if (jobSalary !="Thoả thuận"){
        const salary_negotiation = false;
    }
    else {
        const salary_negotiation = true;
    }
    //console.log(jobtitle,job_description,job_requirement,job_benefit,job_location,job_Deadline,jobQuantity,jobType,jobExperience,jobSkill,jobSalary);
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
        type_of_work: jobType,
        skill: jobSkill.split(","),
        salary: jobSalary,
        salary_negotiation: salary_negotiation,
        last_date: jobDeadline,
        level:""
    });
    console.log(job);
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