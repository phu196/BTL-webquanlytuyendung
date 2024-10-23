const passport = require("passport");
const jwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const User = require("../models/User");

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
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
