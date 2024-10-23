const mongoose = require('mongoose');
const ApplicantSchema = new mongoose.Schema({
    applicant_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    applicant_name: {
        type: String,
        required: [true, "Applicant name is not provided"]
    },
    applicant_email: {
        type: String,
        required: [true, "Applicant email is not provided"]
    },
    applicant_phone: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                // Kiểm tra định dạng số điện thoại (10 chữ số)
                return /\d{10}/.test(v);
            },
            message: props => `${props.value} không phải là số điện thoại hợp lệ!`
        }
    },
    applicant_cv: {
        type: String
    },
    applicant_job: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job_list',
    }]
});
module.exports = mongoose.model('Applicant', ApplicantSchema);