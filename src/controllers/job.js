const Job = require("../models/Job");
const Company = require("../models/Company");
const { search } = require("../routes/auth");

const searchJob = async (req, res) => {
    const keyword = req.query.q || ""; // Nhận từ khóa từ URL

    // Hàm thoát các ký tự đặc biệt trong biểu thức chính quy
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // Thêm ký tự thoát trước ký tự đặc biệt
    }

    const escapedKeyword = escapeRegExp(keyword);
    const regex = new RegExp(escapedKeyword, "i"); // Tạo biểu thức chính quy không phân biệt hoa thường

    const jobs = await Job.find({ title: regex }).sort({ last_date: -1 }); // Tìm kiếm các công việc theo tiêu đề khớp với từ khóa
    // jobs.sort((a, b) => new Date(b.last_date) - new Date(a.last_date)); // Sắp xếp theo ngày hết hạn
    var searchJobs = [];
    await Promise.all(
        jobs.map(async (job) => {
            const company = await Company.findById(job.company_id).select("company_logo");
            if (company) {
                searchJobs.push({
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
    res.render("jobIT.ejs", {
        title: "Việc làm IT", // Đặt tiêu đề trang
        jobs: searchJobs, // Truyền dữ liệu jobs sang view
    });
};
module.exports = { searchJob };
