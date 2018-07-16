import mongoose from 'mongoose';

export interface IArticale extends mongoose.Document {
    username: string,
    userId: string,
    time: Date,
    content: string,
    title: string,
}

export interface IArticaleModel extends mongoose.Model<IArticale> {

}

const articaleSchema = new mongoose.Schema({
    username: { type: String, required: true },
    userId: { type: String, required: true },
    time: { type: Date, required: true },
    content: { type: String, required: true },
    title: { type: String, required: true },
});

const Article: IArticaleModel = mongoose.model<IArticale, IArticaleModel>('Article', articaleSchema);
export default Article;