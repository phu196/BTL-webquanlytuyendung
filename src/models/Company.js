const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema(
    {
        company_name: {
            type: String,
            required: [true, "Company name is not provided"],
        },
        location: {
            type: String,
        },
        company_description: {
            type: String,
        },
        company_logo: {
            type: String,
        },
        company_website: {
            type: String,
        },
        company_email: {
            type: String,
        },
        password: {
            type: String,
            required: [true, "Password is not provided"],
        },
        company_phone: {
            type: String,
            required: true,
            validate: {
                validator: function (v) {
                    // Kiểm tra định dạng số điện thoại (10 chữ số)
                    return /\d{10}/.test(v);
                },
                message: (props) => `${props.value} không phải là số điện thoại hợp lệ!`,
            },
        },
        company_address: {
            detail: String,
            ward: String,
            district: String,
            province: String,
        },
        company_jobs: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Job",
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Company", CompanySchema);
