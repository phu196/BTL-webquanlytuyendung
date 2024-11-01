const company = require('./company_routes');

function router(app){
    app.use('/company', company);
}

module.exports = router;