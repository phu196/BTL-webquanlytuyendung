const Job = require("../models/Job");

//[GET] /company/my_job/:id/edit
const editJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({ message: "Not Found" });
        }

        res.render("job/edit", { job });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "This id is not exist" });
    }
};

const postEditJob = async (req, res) => {
    try {
        const jobId = req.params.id;

        await Job.findByIdAndUpdate(jobId, {
            title: req.body.title,
            salary: req.body.salary,
            salary_negotiation: req.body.salary_negotiation === "on",
            region: req.body.region,
            job_experience: req.body.job_experience,
            last_date: new Date(req.body.last_date),
            job_type: req.body.job_type,
            job_description: req.body.job_description,
            job_requirement: req.body.job_requirement,
            job_benefit: req.body.job_benefit,
            location: req.body.location,
            job_time: req.body.job_time,
            level: req.body.level,
            number_of_recruitment: req.body.number_of_recruitment,
            job_status: req.body.job_status === "on",
            type_of_work: req.body.type_of_work,
            skill: req.body.skill ? req.body.skill.split(",").map((s) => s.trim()) : [],
        });

        res.redirect("/"); // tạm thời về trang ban đầu
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
};

const showJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate("company_id");

        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        // Render view với thông tin job
        res.render("job/show", { job });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "This id is not exist" });
    }
};

module.exports = { editJob, postEditJob, showJob };
