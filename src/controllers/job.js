const Job = require("../models/Job");
const User = require('../models/User');
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


const applyToJob = async (req, res) => {
    try {
        const jobId = req.params.jobId;
        const userId = req.user.id; // Assuming user ID is available in `req.user`

        // Find user and update their applied jobs
        const user = await User.findById(userId);
        if (!user.appliedJobs.includes(jobId)) {
            user.appliedJobs.push(jobId);
            await user.save();
        }

        res.status(200).json({ message: 'Job application successful' });
    } catch (error) {
        res.status(500).json({ message: 'Error applying to job', error });
    }
};
module.exports = { searchJob,
    applyToJob,
 };
