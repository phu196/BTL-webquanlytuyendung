const passport = require("passport");
const jwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const User = require("../models/User");
const Company = require("../models/Company");

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
    passReqToCallback: true,
};

passport.use(
    "jwt",
    new jwtStrategy(options, async (req, jwtPayload, done) => {
        try {
            const { userId, companyId } = { ...jwtPayload };
            if (userId) {
                const user = await User.findById(userId);
                if (!user) {
                    return done(null, false);
                }
                req.user = user;
                return done(null, user);
            } else if (companyId) {
                const company = await Company.findById(companyId);
                if (!company) {
                    return done(null, false);
                }
                req.company = company;
                return done(null, company);
            }
        } catch (error) {
            return done(error, false);
        }
    })
);

module.exports = passport;
