import mongoose from 'mongoose';

export interface IWork extends mongoose.Document {
    name: string,
    description: string,
    metadata: { key: string, value: string, }[],
    tags: string[],
    comments: [{
        username: string,
        userId: string,
        content: string,
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
            value: String,
        }],
        default: [],
    },
    tags: [{ type: String, default: [], }],
    comments: [{
        username: { type: String, required: true, },
        userId: { type: String, required: true, },
        content: { type: String, required: true, },
        time: { type: Date, default: Date.now, },
    }],
    episodes: { type: Number, default: 1, },
})

const Work: IWorkModel = mongoose.model<IWork, IWorkModel>('Work', workSchema);
export default Work;