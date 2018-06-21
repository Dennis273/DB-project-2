import mongoose from 'mongoose';
import User from './userModel';
import Work from './workModel';
const ObjectId = mongoose.Schema.Types.ObjectId
export interface IUserwork extends mongoose.Document {
    userId: mongoose.Schema.Types.ObjectId,
    workId: mongoose.Schema.Types.ObjectId,
    like: Boolean,
    rate: string,
    watched: Number,
    _watched: Number[],

}
export interface IUserworkModel extends mongoose.Model<IUserwork> {
    setLike: (userId: mongoose.Schema.Types.ObjectId, workId: mongoose.Schema.Types.ObjectId, like: boolean) => Promise<Boolean>
}
const userworkSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User', validate: {
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
        type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Work', validate: {
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


const setLike = async function (userId: mongoose.Schema.Types.ObjectId, workId: mongoose.Schema.Types.ObjectId, like: boolean): Promise<Boolean> {
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