import { Request, Response, NextFunction } from "express";
import '../config/passport'
import passport from 'passport';
import User, { IUser } from "../model/userModel";
import { IVerifyOptions } from "passport-local";
import { ResponseMessage, ErrorMessages } from "../util/errorMessage";

export let login = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('local', (err: Error, user: IUser, info: IVerifyOptions) => {
        if (err) {
            return res.status(200).json(new ResponseMessage([ErrorMessages.unknownError]));
        } else if (!user) {
            return res.status(200).json(new ResponseMessage([ErrorMessages.userNotExist]));
        } else req.logIn(user, (err) => {
            return res.status(200).json(new ResponseMessage());
        });
    })(req, res, next);
};

export let logout = (req: Request, res: Response) => {
    req.logout();
    return res.status(200).json(new ResponseMessage());
};

export let register = async (req: Request, res: Response, next: NextFunction) => {
    const user = new User({
        email: req.body.email.toLowerCase(),
        username: req.body.username,
        password: req.body.password,
    });
    const [existingEmail, existingUsername] = await Promise.all([
        User.findOne({ email: req.body.email.toLowerCase() }).exec(),
        User.findOne({ username: req.body.username }).exec(),
    ]);
    let errors: ErrorMessages[] = [];
    if (existingEmail) errors.push(ErrorMessages.emailExist);
    if (existingUsername) errors.push(ErrorMessages.usernameExist);
    if (errors.length === 0) {
        await user.save();
        req.logIn(user, (err) => {
            return res.status(200).json(new ResponseMessage());
        });
    } else return res.status(200).json(new ResponseMessage(errors));

}