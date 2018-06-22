import { Request, Response, NextFunction } from "express";
import '../config/passport'
import passport from 'passport';
import User, { IUser } from "../model/userModel";
import { IVerifyOptions } from "passport-local";
import { ResponseMessage, ErrorMessages } from "../util/utilities";
import Userwork from "../model/userworkModel";

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
export let getUserInfo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let user: IUser;
        if (req.params.userId) {
            user = await User.findById(req.params.userId);
            if (!user) {
                res.status(200).json(new ResponseMessage([ErrorMessages.userNotExist]));
            } else {
                return res.status(200).json(new ResponseMessage([], user));
            }
        } else {
            user = await User.findById(req.user._id);
            return res.status(200).json(new ResponseMessage([], user));
        }
    } catch (error) {
        console.log(error);
        res.status(200).json(new ResponseMessage([ErrorMessages.unknownError]));
    }
}
export let getUserLikes = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let user;
        if (req.params.userId) {
            user = await User.findById(req.params.userId);
            if (!user) {
                return res.status(200).json(new ResponseMessage([ErrorMessages.userNotExist]));
            }
        } else {
            user = req.user;
        }
        const likes = await Userwork.find({ userId: user.id, like: true });
        return res.status(200).json(new ResponseMessage([], { likes }));
    } catch (error) {
        res.status(200).json(new ResponseMessage([ErrorMessages.unknownError]));
    }
}
export let setUserFollow = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await req.user.setFollow(req.params.userId, true);
        return res.status(200).json(new ResponseMessage());
    } catch (error) {
        console.log(error);
        return res.status(200).json(new ResponseMessage([ErrorMessages.unknownError]));
    }
}
export let setUserUnfollow = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await req.user.setFollow(req.params.userId, false);
        return res.status(200).json(new ResponseMessage());
    } catch (error) {
        console.log(error);
        return res.status(200).json(new ResponseMessage([ErrorMessages.unknownError]));
    }
}