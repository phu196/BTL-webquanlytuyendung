const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'longnb1211@gmail.com',
        pass: 'ddjn tiat lylv pjoh'
    }
})

module.exports = transporter;