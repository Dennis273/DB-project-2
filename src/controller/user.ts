import { Request, Response, NextFunction } from "express";
import '../config/passport'
import passport from 'passport';
import User, { IUser } from "../model/userModel";
import { IVerifyOptions } from "passport-local";

export let login = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('local', (err: Error, user: IUser, info: IVerifyOptions) => {
        if (err) {
            res.status(200).end();
        } else if (!user) {
            return res.status(200).json({
                loginSuccess: false,
            });
        } else req.logIn(user, (err) => {
            return res.status(200).json({
                loginSuccess: true,
            });
        });
    })(req, res, next);
};

export let logout = (req: Request, res: Response) => {
    req.logout();
    return res.status(200).end();
};

export let register = async (req: Request, res: Response, next: NextFunction) => {
    const user = new User({
        email: req.body.email,
        username: req.body.username.toLowerCase(),
        password: req.body.password,
    });
    const existingEmail = await User.findOne({ email: req.body.email });
    const existingUsername = await User.findOne({ username: req.body.username.toLowerCase() });
    if (!existingEmail && !existingUsername) {
        await user.save();
        req.logIn(user, (err) => {
            return res.status(200).json({
                registerSuccess: true,
            });
        });
    } else {
        return res.status(200).json({
            registerSuccess: false,
            existingEmail: existingEmail !== null,
            existingUsername: existingUsername !== null,
        });
    }

}