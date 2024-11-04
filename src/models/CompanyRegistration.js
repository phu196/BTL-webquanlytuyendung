const mongoose = require("mongoose");

const CompanyRegistrationSchema = new mongoose.Schema(
    {
        companyName: {
            type: String,
            required: [true, "Company name is not provided"],
        },
        fullName: {
            type: String,
            required: [true, "Name is not provided"],
        },
        email: {
            type: String,
            required: [true, "Email is not provided"],
        },
        currentPosition: {
            type: String,
            required: [true, "Current position is not provided"],
        },
        phoneNumber: {
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
        jobRequirement: {
            type: String,
            required: [true, "Description is not provided"],
        },
        status: {
            type: String,
            default: "pending",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("CompanyRegistration", CompanyRegistrationSchema);
