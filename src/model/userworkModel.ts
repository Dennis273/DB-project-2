import mongoose from 'mongoose';

export type UserworkModel = mongoose.Document & {
    userId: mongoose.Schema.Types.ObjectId,
    workId: mongoose.Schema.Types.ObjectId,
    rate: string,
    watched: Number,
}
const userworkSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    workId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Work',
    },
    rate: String,
    watched: Number,
});

const Userwork = mongoose.model('Userwork', userworkSchema);
export default Userwork;