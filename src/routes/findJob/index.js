const jobITRoutes = require("./jobIT")

module.exports = (app) => {
    app.use("/viec-lam-it", jobITRoutes)
}