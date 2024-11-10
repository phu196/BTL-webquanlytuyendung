const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
    company_name: {
        type: String,
        required: [true, "Company name is not provided"]
    },
    location: {
        type: String,
        required: [true, "Location is not provided"]
    },
    company_description: {
        type: String,
        required: [true, "Company description is not provided"]
    },
    company_logo: {
        type: String
    },
    company_TIN:{
        type: String,
        required: [true, "Company TIN is not provided"]
    },
    company_website: {
        type: String
    },
    company_email: {
        type: String
    },
    company_phone: {
        type: String
    },
    company_address: {
        detail: String,
        ward: String,
        district: String,
        province: String,
        country: String
    },
    company_job: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
    }]
});

module.exports = mongoose.model('Company', CompanySchema,"companies");