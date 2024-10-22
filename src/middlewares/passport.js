const passport = require("passport");
const jwtStrategy = require("passport-jwt").Strategy;

const User = require("../models/User");

const extractCookie = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies["token"];
    }
    return token;
};

const options = {
    jwtFromRequest: extractCookie,
    secretOrKey: process.env.JWT_SECRET,
    passReqToCallback: true,
};

passport.use(
    "jwt",
    new jwtStrategy(options, async (req, jwtPayload, done) => {
        try {
            const user = await User.findById(jwtPayload.id);
            if (!user) {
                return done(null, false);
            }
            req.user = user;
            return done(null, user);
        } catch (error) {
            return done(error, false);
        }
    })
);

module.exports = passport;
