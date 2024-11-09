const jobIT = require("../models/Job")
const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");

module.exports.index = async (req, res) => {
    const keyword = req.query.q || ''; // Nhận từ khóa từ URL

    // Hàm thoát các ký tự đặc biệt trong biểu thức chính quy
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Thêm ký tự thoát trước ký tự đặc biệt
    }

    const escapedKeyword = escapeRegExp(keyword);
    const regex = new RegExp(escapedKeyword, "i"); // Tạo biểu thức chính quy không phân biệt hoa thường

    const jobs = await jobIT.find({ title: regex }); // Tìm kiếm các công việc theo tiêu đề khớp với từ khóa
    jobs.sort((a, b) => new Date(b.last_date) - new Date(a.last_date)); // Sắp xếp theo ngày hết hạn

    res.render("jobIT.ejs", {
        title: "Việc làm IT", // Đặt tiêu đề trang
        jobs: jobs, // Truyền dữ liệu jobs sang view
    });
};

