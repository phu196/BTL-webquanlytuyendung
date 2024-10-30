"use strict"
const mongoose = require("mongoose");
const JobSchema = new mongoose.Schema({
    title :{
        type : String,
        require : [true, "Title is not provided"]
    },
    salary_from:{
        type : Number
    },
    salary_to:{
        type : Number
    },
    salary_currency:{
        type : String,
        require : [true, "Currency is not provided"]
    },
    salary_negotiation:{
        type : Boolean,
        default : false
    },
    region:{
        type : String,
        require : [true, "Location is not provided"]
    },
    job_experience:{
        type : Number,
        require : [true, "Experience is not provided"]
    },
    last_date:{
        type : Date,
        require : [true, "Last date is not provided"]
    },
    job_type:{
        type : String,
        require : [true, "Job type is not provided"]
    },
    job_description:{
        type : String,
        require : [true, "Job description is not provided"]
    },
    job_requirement:{
        type : String,
        require : [true, "Job requirement is not provided"]
    },
    job_benefit:{
        type : String,
        require : [true, "Job benefit is not provided"]
    },
    company_name:{
        type : String,
        require : [true, "Company name is not provided"]
    },
    company_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    location:{
        type : String,
        require : [true, "Location is not provided"]
    },
    job_time:{
        type : String,
        require : [true, "Job time is not provided"]
    },
    level:{
        type : String,
        require : [true, "Level is not provided"]
    },
    number_of_recruitment:{
        type : Number,
        require : [true, "Number of recruitment is not provided"]
    },
    job_status:{
        type : Boolean,
        require : [true, "Job status is not provided"],
        default : true
    },
    type_of_work:{
        type : String,
        require : [true, "Type of work is not provided"]
    },
    skill:[{
        type : String,
        require : [true, "Skill is not provided"]
    }],
    applicant:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],



});
const Job = mongoose.model('Job', JobSchema,"jobs");
module.exports = Job;