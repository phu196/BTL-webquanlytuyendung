const Company = require("../models/Company");
const Job = require("../models/Job");
const bcrypt = require("bcrypt");

const { StatusCodes } = require("http-status-codes");
const CompanyRegistration = require("../models/CompanyRegistration");

const getCompanyInfo = async (req, res) => {
    res.json({ success: true, message: "Company found" });
};

const register = async (req, res) => {
    const { companyName, fullName, email, currentPosition, phoneNumber, jobRequirement } = req.body;

    // validate
    if (!companyName || !fullName || !email || !currentPosition || !phoneNumber || !jobRequirement) {
        return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "Missing required fields" });
    }
    // check phone number
    if (!/\d{10}/.test(phoneNumber)) {
        return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "Invalid phone number" });
    }
    // check email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "Invalid email" });
    }
    const companyRegistration = new CompanyRegistration({
        companyName,
        fullName,
        email,
        currentPosition,
        phoneNumber,
        jobRequirement,
    });
    await companyRegistration.save();
    res.status(StatusCodes.CREATED).json({
        success: true,
        message: "Your information was send to administrator. We'll contact you as soon as possible!",
    });
};
// [GET] /company/:id
const index = async (req, res) => {
    //const id = "6720a18f8213b3da13ecb3a1"
    // const id = req.params.id;
    // console.log(req.params)
    const id = req.query.id;
    try {
        const company = await Company.findById(id).populate("company_jobs");

        res.render("company/layout/mainpage", {
            company: company,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

//[GET] /comapny/:id/company_page
const companyDetail = async (req, res) => {
    const id = req.params.id;
    try {
        const company = await Company.findById(id).populate("company_jobs");

        res.render("company/layout/company_view", {
            company: company,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

// [GET] /company/:id/post
const companyJobs = async (req, res) => {
    res.render("./company/layout/job_post");
};

// [POST] /company/:id/post
const postCompanyJobs = async (req, res) => {
    // console.log(req.body)
    const id = req.params.id;
    const {
        jobTitle,
        jobDescription,
        jobRequirement,
        jobBenefit,
        jobLocation,
        jobDeadline,
        jobQuantity,
        jobType,
        jobTime,
        jobExperience,
        jobSkill,
        jobSalary,
    } = req.body;
    const company = await Company.findById(id);
    const isExit = await Job.findOne({ title: jobTitle });
    if (isExit) {
        return res.status(400).send("Job already exists");
    } else {
        const salary_negotiation = false;
        let skill = [];
        if (jobSkill) {
            skill = jobSkill.split(",");
        } else {
            console.error("jobSkill is undefined or null");
        }
        if (jobSalary != "Thoả thuận") {
            const salary_negotiation = false;
        } else {
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
            level: "",
        });
        try {
            await job.save();
            company.company_jobs.push(job);
            await company.save();
            res.redirect(`/company?id=${id}`);
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    }
};

// [DELETE] /company/:id/delete-job/:job_id
const deleteJob = async (req, res) => {
    const id = req.params.id;
    const job_id = req.params.job_id;

    try {
        await Job.findByIdAndDelete(job_id);
        const company = await Company.findById(id);
        if (company) {
            company.company_jobs.pull(job_id);
            await company.save();
        }

        res.redirect(`/company?id=${id}`);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};
// [GET] /company/:id/view-candidates/:job_id
const viewCandidates = async (req, res) => {
    const id = req.params.id;
    const job_id = req.params.job_id;
    console.log(job_id, id);
    try {
        const job = await Job.findById(job_id).populate("applicant");
        const candidates = job.applicant;
        res.render("./company/layout/view_candidates", {
            candidates: candidates,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};
//[POST] /company/:id/update
const postEditCompany = async (req, res) => {
    try {
        const companyId = req.params.id;

        // Cập nhật thông tin công ty
        await Company.findByIdAndUpdate(companyId, {
            company_name: req.body.company_name,
            location: req.body.location,
            company_description: req.body.company_description,
            company_TIN: req.body.company_TIN,
            company_website: req.body.company_website,
            company_email: req.body.company_email,
            company_phone: req.body.company_phone,
            company_address: {
                detail: req.body.addressDetail,
                ward: req.body.ward,
                district: req.body.district,
                province: req.body.province,
                country: req.body.country,
            },
        });

        // Tạm thời chuyển hướng về trang ban đầu, sau này có profile của công ty thì trả về trang chủ công ty
        res.redirect("/");
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
};
//[GET] /company/:id/edit
const edit = async (req, res) => {
    try {
        // Lấy ID từ URL
        const companyId = req.params.id;

        // Tìm công ty theo ID
        const company = await Company.findById(companyId);

        // Kiểm tra xem có tìm thấy công ty không
        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }

        res.render("company/edit", { company });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "This id is not exist" });
    }
};
module.exports = {
    getCompanyInfo,
    register,
    index,
    companyDetail,
    companyJobs,
    postCompanyJobs,
    deleteJob,
    viewCandidates,
    postEditCompany,
    edit,
};
