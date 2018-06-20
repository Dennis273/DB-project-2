import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

export type UserModel = mongoose.Document & {
    username: string,
    password: string,
    role: string,
    comparePassword: comparePasswordFunction,
}
type comparePasswordFunction = (candidatePassword: string, cb: (err: any, isMatch: any) => void) => void;

const userSchema = new mongoose.Schema({
    password: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        default: "default",
    }
});

userSchema.pre('save', async function () {
    const user = this;
    if (user.isModified('password')) {
        // user has type Document, cannot directly access property 'password'
        const hash = await bcrypt.hash(user.toObject().password, 10);
        user.set({password: hash});
    }
});

const comparePassword: comparePasswordFunction = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err: mongoose.Error, isMatch: boolean) => {
        cb(err, isMatch);
    });
};
userSchema.methods.comparePassword = comparePassword;
const User = mongoose.model('User', userSchema);
export default User;