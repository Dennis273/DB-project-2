import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { ErrorMessages } from '../util/utilities';
import InsiteMessage from './insiteMessageModel';
import _ from 'lodash';
export interface IUser extends mongoose.Document {
    username: string,
    password: string,
    role: string,
    follower: string[],
    following: string[],
    comparePassword: comparePasswordFunction,
    setFollow: setFollowFunction,
    sendMessage: sendMessageFunction,
}
export interface IUserModel extends mongoose.Model<IUser> {
    // static functions
}
type comparePasswordFunction = (candidatePassword: string, cb: (err: any, isMatch: any) => void) => void;
type setFollowFunction = (targetUserId: string, isFollow: boolean) => Promise<void>;
type sendMessageFunction = (targetUserId: string, content: string) => Promise<void>;
const userSchema = new mongoose.Schema({
    password: { type: String, required: true, },
    username: { type: String, required: true, unique: true, },
    email: { type: String, required: true, unique: true, },
    role: { type: String, default: "default", },
    following: { type: [String], default: [] },
    follower: { type: [String], default: [] },
});

userSchema.pre('save', async function () {
    const user = this;
    if (user.isModified('password')) {
        // user has type Document, cannot directly access property 'password'
        const hash = await bcrypt.hash(user.toObject().password, 10);
        user.set({ password: hash });
    }
});

const comparePassword: comparePasswordFunction = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err: mongoose.Error, isMatch: boolean) => {
        cb(err, isMatch);
    });
};
const setFollow: setFollowFunction = async function (targetUserId: string, follow) {
    if (targetUserId === this.id) throw new Error(ErrorMessages.illegalOperation);
    if (follow == this.following.includes(targetUserId)) throw new Error(ErrorMessages.illegalOperation);
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) throw new Error(ErrorMessages.userNotExist);
    try {
        if (follow) {
            targetUser.follower.push(this.id);
            this.following.push(targetUserId);
        } else {
            targetUser.follower = targetUser.follower.filter(val => val != this.id);
            this.following = this.following.filter((val: string) => val != targetUserId);
            // _.pull(targetUser.follower, this.id);
            // _.pull(this.following, targetUserId);
        }
        await Promise.all([
            this.save(),
            targetUser.save()
        ]);
    } catch (error) {
        console.log(error);
        throw new Error(ErrorMessages.unknownError);
    }
}
const sendMessage: sendMessageFunction = async function (targetUserId, content) {
    if (targetUserId === this.id) throw new Error(ErrorMessages.illegalOperation);
    const targetUser = await User.findById(targetUserId);
    if (targetUser) {
        await InsiteMessage.sendInsiteMessage(this.id, targetUserId, content);
    } else throw new Error(ErrorMessages.userNotExist);
}
userSchema.methods.sendMessage = sendMessage;
userSchema.methods.setFollow = setFollow;
userSchema.methods.comparePassword = comparePassword;
const User: IUserModel = mongoose.model<IUser, IUserModel>('User', userSchema);
export default User;