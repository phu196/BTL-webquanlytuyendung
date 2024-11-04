require("dotenv").config({ path: ".env.example" }); // TODO: Change to .env in production
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");

const app = express();

// Load routes
const router = require("./routes");
const { title } = require("process");

// Middleware
app.use(morgan("dev"));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
    express.static(path.join(__dirname, "public"), {
        maxAge: "1d", // cache for 1 day
    })
);

const passport = require("./middlewares/passport");
app.use(passport.initialize());

// Template engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// MongoDB connection
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));

// Routes
app.use("/auth", router.authRoutes);
app.use("/user", router.userRoutes);
app.use("/company", router.companyRoutes);
app.get("/", (req, res) => {
    const companies = [
        {
            logo: "/images/company_logo.png",
            title: "Senior Back-End Developer",
            companyName: "PRIME TECH SOLUTION COMPANY LIMITED",
            location: "Quận Gò Vấp, Hồ Chí Minh",
            keywords: ["Java", "MySQL", "Docker", "Spring Boot"],
        },
        {
            logo: "/images/company_logo.png",
            title: "IT - Software Engineer (Core Banking)",
            companyName: "NGÂN HÀNG Á CHÂU (ACB)",
            location: "Thành phố Hồ Chí Minh (+1)",
            keywords: ["Oracle", "Java", ".NET", "PostgreSQL"],
        },
        {
            logo: "/images/company_logo.png",
            title: "Java Developer",
            companyName: "SoftRoad Việt Nam",
            location: "Quận Cầu Giấy, Hà Nội",
            keywords: ["OOP", "Java Spring", "Java Spring Boot"],
        },
        {
            logo: "/images/company_logo.png",
            title: "BackEnd Developer (NodeJS)",
            companyName: "Eduvator",
            location: "Thành phố Hồ Chí Minh",
            keywords: ["NodeJS", "Back-End", "ExpressJS", "NestJS"],
        },
        {
            logo: "/images/company_logo.png",
            title: "Manual QC Engineer (Mid-Senior level)",
            companyName: "One Mount Group",
            location: "Quận Hai Bà Trưng, Hà Nội",
            keywords: ["QC", "Manual Tester"],
        },
        {
            logo: "/images/company_logo.png",
            title: "Senior Embedded Software Engineer",
            companyName: "Công ty TNHH Yura Corporation Bắc Ninh",
            location: "Quận Cầu Giấy, Hà Nội",
            keywords: ["Linux", "Git", "C/C++", "Embedded Engineer"],
        },
    ];
    const newestJobs = [
        {
            logo: "/images/job_logo.png",
            title: "Kỹ Sư Lập Trình Mobile App",
            companyName: "CÔNG TY TNHH CUNG CẤP GIẢI PHÁP VIVAS",
            location: "Hà Nội",
            keywords: ["MVC", "Mobile", "Flutter"],
        },
        {
            logo: "/images/job_logo.png",
            title: "Senior Manager, Quality Assurance",
            companyName: "NEC Vietnam",
            location: "TP. Hồ Chí Minh",
            keywords: ["Manager", "Project Manager"],
        },
        {
            logo: "/images/job_logo.png",
            title: "DevOps Engineer (ID: TS090602)",
            companyName: "Talent Success",
            location: "Đà Nẵng",
            keywords: ["Linux", "MySQL", "Azure"],
        },
        {
            logo: "/images/job_logo.png",
            title: "Software Tester",
            companyName: "BSS Group",
            location: "Hồ Chí Minh",
            keywords: ["Tester", "Manual Test"],
        },
        {
            logo: "/images/job_logo.png",
            title: "Game Developer (Python và Lua)",
            companyName: "TNT MEDIA & ISOCIA",
            location: "Hà Nội",
            keywords: ["Python", "Lua", "Golang"],
        },
        {
            logo: "/images/job_logo.png",
            title: "Head of Development, IT",
            companyName: "Public Bank Vietnam (PBVN)",
            location: "Hà Nội",
            keywords: ["ASP.NET", "C#", "Java EE"],
        },
    ];

    res.render("index", {
        title: "TopDev Clone",
        companies: companies,
        newestJobs: newestJobs,
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log();
});
