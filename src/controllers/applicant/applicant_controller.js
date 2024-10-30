const User = require('../../models/User');
// [GET] /applicant
module.exports.index = async(req,res) =>{
    const applicant = await User.findAll();
    res.render("applicant/layout/default",{
        applicant : applicant
    })
}
// [GET] /applicant_changeInfo
module.exports.changeInfo = async(req,res) =>{
    const applicant = await User.findAll();
    res.render("applicant/layout/default",{
        applicant : applicant
    })
}