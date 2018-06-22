import mongoose from 'mongoose';
import User from './userModel';
import Work from './workModel';
export interface IUserwork extends mongoose.Document {
    userId: string,
    workId: string,
    like: Boolean,
    rate: string,
    watched: Number,
    _watched: Number[],

}
export interface IUserworkModel extends mongoose.Model<IUserwork> {
    setLike: (userId: string, workId: string, like: boolean) => Promise<Boolean>
}
const userworkSchema = new mongoose.Schema({
    userId: {
        type: String, validate: {
            isAsync: true,
            validator: function (value, cb) {
                User.findById(value, (error, user) => {
                    if (error || !user) cb(false);
                    else cb(true);
                });
            }
        }
    },
    workId: {
        type: String, required: true, validate: {
            isAsync: true,
            validator: function (value, cb) {
                Work.findById(value, (error, work) => {
                    if (error || !work) cb(false);
                    else cb(true);
                });
            }
        }
    },
    like: { type: Boolean, default: false, },
    rating: { type: String, default: "", },
    watched: { type: Number, default: 0, },
    _watched: { type: [Number], default: [], },
});


const setLike = async function (userId: string, workId: string, like: boolean): Promise<Boolean> {
    try {
        let userwork = await Userwork.findOne({ userId, workId });
        if (!userwork) {
            userwork = new Userwork({
                userId,
                workId,
                like,
            });
            await userwork.save();
        } else {
            await userwork.set('like', like).save();
        }
        return true
    } catch (error) {
        console.log(error);
        return false
    }
}

userworkSchema.statics.setLike = setLike;
const Userwork: IUserworkModel = mongoose.model<IUserwork, IUserworkModel>('Userwork', userworkSchema);
export default Userwork;