import passport from 'passport';
import passportLocal from 'passport-local';
import User, { UserModel } from '../model/userModel'
import { Request, Response, NextFunction } from 'express';

const LocalStrategy = passportLocal.Strategy;

passport.serializeUser<any, any>((user, done) => {
    done(undefined, user._id);
})

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

passport.use(new LocalStrategy(
    (username, password, done) => {
        User.findOne({ username }, (err, user: UserModel) => {
            if (err) return done(err);
            if (!user) {
                return done(undefined, false, {message: `Username ${username} not found`});
            }
            user.comparePassword(password, (err: Error, isMatch: boolean) => {
                if (err) return done(err);
                if (isMatch) return done(undefined, user);
                return done(undefined, false, {message: "Invalid email or password."});
            });
        });
    }
));