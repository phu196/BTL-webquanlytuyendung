const User = require("../models/User");
const mongoose = require("mongoose");
const { StatusCodes } = require("http-status-codes");

const getUserInfo = async (req, res) => {
    try {
        const userId = req.user._id; // Lấy id từ token
        console.log(userId);
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.render('profile', { user });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

// Hiển thị trang cập nhật thông tin
const updateUser = async (req, res) => {
    const method = req.method; // Kiểm tra HTTP method
    const userId = req.user._id;

    if (method === 'GET') {
        // GET: Render trang cập nhật
        try {
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).send('User not found');
            }
            res.render('updateProfile', { user });
        } catch (error) {
            console.error(error);
            res.status(500).send('Server Error');
        }
    } else if (method === 'POST') {
        // POST: Xử lý cập nhật thông tin
        try {
            const { fullname, phoneNumber, gender, address } = req.body;
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                {
                    fullname,
                    phoneNumber,
                    gender,
                    address: {
                        detail: address.detail,
                        ward: address.ward,
                        district: address.district,
                        province: address.province,
                    },
                },
                { new: true, runValidators: true }
            );
            res.redirect('/user/profile'); // Quay lại trang profile sau khi cập nhật
        } catch (error) {
            console.error(error);
            res.status(500).send('Update failed');
        }
    }
};


const getAppliedJobs = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('appliedJobs');
        res.render('user/applied-jobs', { jobs: user.appliedJobs });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};
const getUserProfileForCompany = async (req, res) => {
    try {
        const userId = req.user._id; // Lấy userId từ token
                const user = await User.findById(userId).populate('appliedJobs'); // Populate các công việc đã ứng tuyển
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.render('profileUser', { user });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};
module.exports = {
    getUserInfo,
    getUserProfileForCompany,
   // getUpdateForm,  // Export hàm render form cập nhật
    updateUser,
    getAppliedJobs,
};
