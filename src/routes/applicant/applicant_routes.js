const applicant = require('./applicant');
module.exports = (app) =>{
    app.use("/applicant",applicant);
}
