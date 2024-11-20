const User = require("../models/User");
const Job = require("../models/Job");
const mongoose = require("mongoose");
const { StatusCodes } = require("http-status-codes");

// Lấy thông tin người dùng
const getUpdate = async (req, res) => {
    try {
        // Kiểm tra ID người dùng từ token
        const userId = req.user ? req.user.id : req.params.id; // Sử dụng req.params.id nếu không có req.user

        if (!userId) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "User ID is not provided" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });
        }
        res.render("updateProfile", { user });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Server error", error: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
        // Lấy userId từ req.body hoặc req.params (nếu không có xác thực JWT)
        const userId = req.body.id || req.params.id;

        if (!userId) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "User ID is not provided" });
        }

        // Kiểm tra và lọc các trường hợp được phép cập nhật
        const allowedFields = ["fullname", "gender", "phoneNumber", "address"];
        const updateData = Object.keys(req.body)
            .filter((key) => allowedFields.includes(key))
            .reduce((obj, key) => {
                obj[key] = req.body[key];
                return obj;
            }, {});

        // Cập nhật người dùng trong cơ sở dữ liệu
        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true });

        if (!updatedUser) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });
        }

        const { password, refreshToken, ...safeUser } = updatedUser._doc;

        res.status(StatusCodes.OK).json({
            message: "User updated successfully",
            user: safeUser,
        });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Error updating user information",
            error: error.message,
        });
    }
};

const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.user._id;
        if (!userId) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "User ID is not provided" });
        }
        const user = await User.findById(userId).populate("appliedJobs");
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });
        }
        res.render("user/appliedJob.ejs", { jobs: user.appliedJobs, user : user });
    }
    catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Error getting applied jobs",
            error: error.message,
        });
}
}
const applyJob = async (req, res) => {
    try {
        const { job_id: jobId } = req.body;
        const userId = req.user?._id;

        if (!userId) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "User ID is not provided" });
        }

        if (!jobId) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Job ID is not provided" });
        }

        // Find user and job in parallel
        const [user, job] = await Promise.all([
            User.findById(userId),
            Job.findById(jobId),
        ]);

        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });
        }

        if (!job) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Job not found" });
        }

        // Check if the job has already been applied
        if (user.appliedJobs.includes(jobId) || job.applicant.includes(userId)) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Job already applied" });
        }

        // Update user's applied jobs and job's applicants
        user.appliedJobs.push(jobId);
        job.applicant.push(userId);

        await Promise.all([user.save(), job.save()]);

        res.status(StatusCodes.OK).json({ message: "Job applied successfully" });
    } catch (error) {
        console.error('Error applying for job:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Error applying job",
            error: error.message,
        });
    }
};

module.exports = {
    getUpdate,
    updateUser,
    getAppliedJobs,
    applyJob,
};
