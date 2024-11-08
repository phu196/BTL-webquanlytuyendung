const company = require('./company_routes');
const job = require('./job_routes');

function router(app){
    app.use('/company', company);
    app.use('/company/my_job', job);
}

module.exports = router;