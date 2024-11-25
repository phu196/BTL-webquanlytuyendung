const Job = require("../models/Job");
const User = require("../models/User");
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

    const jobs = await Job.find({ title: regex }); // Tìm kiếm các công việc theo tiêu đề khớp với từ khóa
    jobs.sort((a, b) => new Date(b.last_date) - new Date(a.last_date)); // Sắp xếp theo ngày hết hạn

    res.render("jobIT.ejs", {
        title: "Việc làm IT", // Đặt tiêu đề trang
        jobs: jobs, // Truyền dữ liệu jobs sang view
    });
};

const showJob = async (req, res) => {
    try {
        const jobId = req.params.jobId;

        const job = await Job.findById(jobId).populate({
            path: "company_id",
            select: "company_name company_logo location company_phone company_email",
        });

        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        res.render("job/show-job-user.ejs", { job });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "This id is not exist" });
    }
};

const applyJob = async (req, res) => {
    try {
        const jobId = req.params.jobId; // Lấy id công việc từ URL
        if (!req.user) {
            res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const { cv } = req.body; // Lấy thông tin người ứng tuyển từ body

        const job = await Job.findById(jobId); // Tìm công việc theo id
        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found" });
        }
        const user = await User.findById(req.user._id).select("-password"); // Tìm người dùng theo id
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const applicant = { userId: user._id, CV: cv }; // Tạo thông tin người ứng tuyển
        job.applicants.push(applicant); // Thêm người ứng tuyển vào danh sách ứng tuyển
        await job.save(); // Lưu công việc
        user.jobs.push(jobId); // Thêm công việc vào danh sách công việc đã ứng tuyển
        await user.save(); // Lưu người dùng
        res.status(200).json({ success: true, message: "Applied successfully" });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Error" });
    }
};
module.exports = { searchJob, showJob, applyJob };
