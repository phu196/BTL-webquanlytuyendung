const passport = require('passport')
const jwtStrategy = require('passport-jwt').Strategy;

const User = require('../models/User');

const extractCookie = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['jwt'];
    }
    return token;
}

const options = {
    jwtFromRequest: extractCookie,
}