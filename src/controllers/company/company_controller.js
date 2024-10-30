const User = require('../../models/User');
const Company = require('../../models/Company');
const Job = require('../../models/Job');
const mongoose = require('mongoose');
// [GET] /company/:id
module.exports.index = async(req,res) =>{
    //const id = "6720a18f8213b3da13ecb3a1"
    // const id = req.params.id;
    // console.log(req.params)
    const id = req.query.id;
    try {
        const company = await Company.findById(id).populate('company_job');
        res.render("company/layout/mainpage", {
            company: company
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

// [GET] /company/setup
module.exports.changeInfo = async(req,res) =>{
    res.render("company/layout/setup")
}

// [POST] /company/setup
module.exports.postChangeInfo = async(req, res) => {
    const { company_name, phone,city,city_name,address,tax_code,website, email, description } = req.body;
    console.log(req.body);
    const [detail, ward, district] = address.split(",");
   
    const company = await Company.find({tax_code: tax_code});
    
    if(company.length !=0){
        console.log(company)
        res.send("Company already exists");
    }
    else{
        await Company.create({
            company_name: company_name,
            company_phone: phone,
            location: city_name,
            company_logo:"",
            company_address: {
                detail: detail,
                ward: ward,
                district: district,
                province: city_name,
                country: "Vietnam"
            },
            company_TIN : tax_code,
            company_website: website,
            company_email: email,
            company_description: description,
            company_job:[]
        });
        res.redirect("/");
    }
    
}