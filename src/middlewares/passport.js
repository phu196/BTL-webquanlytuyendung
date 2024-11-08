const passport = require("passport");
const jwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const User = require("../models/User");
const Company = require("../models/Company");

const extractJWTFromCookie = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies["session"];
    }
    return token;
};

const options = {
    jwtFromRequest: extractJWTFromCookie,
    secretOrKey: process.env.JWT_SECRET,
    passReqToCallback: true,
};

passport.use(
    "jwt-admin",
    new jwtStrategy(options, async (req, jwtPayload, done) => {
        try {
            const { id } = { ...jwtPayload };
            const admin = await User.findById(id);
            if (!admin || !(admin.role === "admin")) {
                return done(null, false);
            }
            req.user = admin;
            return done(null, admin);
        } catch (error) {
            return done(error, false);
        }
    })
);

passport.use(
    "jwt",
    new jwtStrategy(options, async (req, jwtPayload, done) => {
        try {
            const { id, identify } = { ...jwtPayload };
            if (id) {
                if (identify === "user") {
                    const user = await User.findById(id);
                    if (user) {
                        req.user = user;
                        return done(null, user);
                    }
                } else if (identify === "company") {
                    const company = await Company.findById(id);
                    if (company) {
                        req.user = company;
                        return done(null, company);
                    }
                }
            }
        } catch (error) {
            return done(error, false);
        }
    })
);

module.exports = passport;
