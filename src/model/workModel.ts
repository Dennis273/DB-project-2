import mongoose from 'mongoose';

export interface IWork extends mongoose.Document {
    name: string,
    description: string,
    metadata: { key: string, data: string, },
    tags: string[],
    comments: [{
        userId: mongoose.Schema.Types.ObjectId,
        comment: string,
        time: Date,
    }],
    episodes: number,
}
export interface IWorkModel extends mongoose.Model<IWork> {

}
const workSchema = new mongoose.Schema({
    name: { type: String, required: true, },
    description: { type: String, },
    metadata: {
        type: [{
            key: String,
            data: String,
        }],
        default: [],
    },
    tags: [{ type: String, default: [], }],
    comments: [{
        userId: { type: mongoose.Schema.Types.ObjectId, required: true, },
        comment: { type: String, required: true, },
        time: { type: Date, default: Date.now, },
    }],
    episodes: { type: Number, default: 1, },
})

const Work: IWorkModel = mongoose.model<IWork, IWorkModel>('Work', workSchema);
export default Work;