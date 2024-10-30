const company = require('./company_routes');
module.exports = (app) => {
    app.use('/company', company);
};