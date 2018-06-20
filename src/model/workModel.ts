import mongoose from 'mongoose';

export type WorkModel = mongoose.Document & {
    name: string,
    description: string,
    metadata: {
        key: string,
        data: string,
    },
    tags: string[],
    comments: [{
        userId: mongoose.Schema.Types.ObjectId,
        comment: string,
        time: Date,
    }],
    episodes: number,
}

const workSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    metadata: {
        type: [{
            key: String,
            data: String,
        }],
        default: [],
    },
    tags: [{
        type: String,
        default: [],
    }],
    comments: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        comment: {
            type: String,
            required: true,
        },
        time: {
            type: Date,
            default: Date.now,
        },
    }],
    episodes: {
        type: Number,
        default: 1,
    },
})

const Work = mongoose.model('Work', workSchema);
export default Work;