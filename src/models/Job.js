"use strict";
const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is not provided"],
            index: true,
        },
        salary: {
            type: String,
            required: [true, "Salary is not provided"],
        },
        isSalaryNegotiation: {
            type: Boolean,
            default: false,
        },
        region: {
            type: String,
            required: [true, "Location is not provided"],
            index: true,
        },
        experienceYears: {
            type: Number,
            required: [true, "Experience is not provided"],
        },
        deadline: {
            type: Date,
            required: [true, "Last date is not provided"],
        },
        type: {
            type: String,
            required: [true, "Job type is not provided"],
        },
        description: {
            type: String,
            required: [true, "Job description is not provided"],
        },
        requirement: {
            type: String,
            required: [true, "Job requirement is not provided"],
        },
        benefit: {
            type: String,
            required: [true, "Job benefit is not provided"],
        },
        companyName: {
            type: String,
            required: [true, "Company name is not provided"],
        },
        logoPath: {
            type: String,
        },
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company",
            required: [true, "Company id is not provided"],
            index: true,
        },
        location: {
            type: String,
            required: [true, "Location is not provided"],
        },
        time: {
            type: String,
            required: [true, "Job time is not provided"],
        },
        level: {
            type: String,
            required: [true, "Level is not provided"],
        },
        number_of_recruitment: {
            type: Number,
            required: [true, "Number of recruitment is not provided"],
        },
        status: {
            type: Boolean,
            required: [true, "Job status is not provided"],
            default: true,
        },
        typeOfWork: {
            type: String,
            required: [true, "Type of work is not provided"],
        },
        skills: [
            {
                type: String,
                required: [true, "Skill is not provided"],
            },
        ],
        applicants: [
            {
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
                CV: String, // title
            },
        ],
    },
    { timestamps: true }
);

const Job = mongoose.model("Job", JobSchema, "jobs");

module.exports = Job;
