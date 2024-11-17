const Company = require("../models/Company");
const Job = require("../models/Job");
const index = async (req, res) => {
    const companies = await Company.find().limit(9).sort({ createdAt: -1 });
    companies.forEach((company) => {
        const jobIds = company.company_jobs;
        const jobNames = [];
        jobIds.forEach(async (jobId) => {
            const job = await Job.findById(jobId);
            if (job) {
                jobNames.push(job.title);
            }
        });
        company.jobNames = jobNames;
    });

    const jobs = await Job.find()
        .limit(3)
        .sort({ createdAt: -1 })
        .select("title company_id company_name location skill salary");
    var newestJobs = [];
    await Promise.all(
        jobs.map(async (job) => {
            const company = await Company.findById(job.company_id).select("company_logo");
            if (company) {
                newestJobs.push({
                    id: job._id,
                    logo: company.company_logo,
                    title: job.title,
                    companyName: job.company_name,
                    salary: job.salary,
                    location: job.location,
                    keywords: job.skill,
                });
            }
        })
    );
    res.render("index", { title: "TopDev Clone", companies, newestJobs });
};

module.exports = {
    index,
};
