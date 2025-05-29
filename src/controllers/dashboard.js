const Company = require("../models/Company");
const Job = require("../models/Job");
const index = async (req, res) => {
    const companies = await Company.find({updated: true}).limit(9).sort({ createdAt: -1 });
    companies.forEach((company) => {
        const jobIds = company.jobs;
        const jobNames = [];
        jobIds.forEach(async (jobId) => {
            const job = await Job.findById(jobId);
            jobIds.forEach(async (jobId) => {
                const job = await Job.findById(jobId);
                if (job) {
                    jobNames.push(job.title);
                }
            });
            company.jobNames = jobNames;
        });
    });
    const jobs = await Job.find({ 
        deadline: { $gte: new Date() } // Lọc job có deadline lớn hơn hoặc bằng thời gian hiện tại
    })
    .limit(9) // Giới hạn 9 job
    .sort({ createdAt: -1 }) // Sắp xếp theo thời gian tạo mới nhất
    .select("title companyId companyName location skills salary");
    var newestJobs = [];
    await Promise.all(
        jobs.map(async (job) => {
            const company = await Company.findById(job.companyId).select("logoPath");
            if (company) {
                newestJobs.push({
                    id: job._id,
                    logo: company.logoPath,
                    title: job.title,
                    companyName: job.companyName,
                    salary: job.salary,
                    location: job.location,
                    keywords: job.skills,
                });
            }   
        })
    );
    res.render("index", { title: "TopDev Clone", companies, newestJobs });
};

module.exports = {
    index,
};