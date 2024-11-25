const Company = require("../models/Company");
const Job = require("../models/Job");

const searchJob = async (req, res) => {
    const keyword = req.query.q || ""; // Nhận từ khóa từ URL

    // Hàm thoát các ký tự đặc biệt trong biểu thức chính quy
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // Thêm ký tự thoát trước ký tự đặc biệt
    }

    const escapedKeyword = escapeRegExp(keyword);
    const regex = new RegExp(escapedKeyword, "i"); // Tạo biểu thức chính quy không phân biệt hoa thường

    const jobs = await Job.find({ title: regex }); // Tìm kiếm các công việc theo tiêu đề khớp với từ khóa
    jobs.sort((a, b) => new Date(b.last_date) - new Date(a.last_date)); // Sắp xếp theo ngày hết hạn

    res.render("jobIT.ejs", {
        title: "Việc làm IT", // Đặt tiêu đề trang
        jobs: jobs, // Truyền dữ liệu jobs sang view
    });
};

const showJob = async (req, res) => {
    try {
        const jobId = req.params.id;

        const job = await Job.findById(jobId).populate({
            path: "company_id",
            select: "company_name company_logo location company_phone company_email",
        });

        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }
        if (!job.company_id) {
            return res.status(404).json({ message: "Company not found" });
        }
        res.render("job/show-job-user.ejs", { job });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "This id is not exist" });
    }
};
module.exports = { searchJob, showJob };
