const Company = require("../models/Company");
const index = async (req, res) => {
    const newestJobs = [
        {
            logo: "/images/job_logo.png",
            title: "Kỹ Sư Lập Trình Mobile App",
            companyName: "CÔNG TY TNHH CUNG CẤP GIẢI PHÁP VIVAS",
            location: "Hà Nội",
            keywords: ["MVC", "Mobile", "Flutter"],
        },
        {
            logo: "/images/job_logo.png",
            title: "Senior Manager, Quality Assurance",
            companyName: "NEC Vietnam",
            location: "TP. Hồ Chí Minh",
            keywords: ["Manager", "Project Manager"],
        },
        {
            logo: "/images/job_logo.png",
            title: "DevOps Engineer (ID: TS090602)",
            companyName: "Talent Success",
            location: "Đà Nẵng",
            keywords: ["Linux", "MySQL", "Azure"],
        },
        {
            logo: "/images/job_logo.png",
            title: "Software Tester",
            companyName: "BSS Group",
            location: "Hồ Chí Minh",
            keywords: ["Tester", "Manual Test"],
        },
        {
            logo: "/images/job_logo.png",
            title: "Game Developer (Python và Lua)",
            companyName: "TNT MEDIA & ISOCIA",
            location: "Hà Nội",
            keywords: ["Python", "Lua", "Golang"],
        },
        {
            logo: "/images/job_logo.png",
            title: "Head of Development, IT",
            companyName: "Public Bank Vietnam (PBVN)",
            location: "Hà Nội",
            keywords: ["ASP.NET", "C#", "Java EE"],
        },
    ];
    const companies = await Company.find();
    companies.forEach((company) => {
        const jobIds = company.company_jobs;
        const jobNames = [];
        jobIds.forEach((jobId) => {
            const job = newestJobs.find((job) => job._id === jobId);
            if (job) {
                jobNames.push(job.title);
            }
        });
        company.jobNames = jobNames;
    });

    res.render("index", { title: "TopDev Clone", companies, newestJobs });
};

module.exports = {
    index,
};
