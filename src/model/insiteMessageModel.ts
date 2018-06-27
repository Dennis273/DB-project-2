import mongoose from 'mongoose';

export interface IInsiteMessage extends mongoose.Document {
    senderId: string,
    reciverId: string,
    time: Date,
    content: string,
}
export interface IInsiteMessageModel extends mongoose.Model<IInsiteMessage> {
    sendInsiteMessage: (userId: string, targetId: string, message: string) => Promise<void>;
}

const insiteMessageSchema = new mongoose.Schema({
    senderId: {
        type: String,
        required: true,
    },
    reciverId: {
        type: String,
        required: true,
    },
    time: {
        type: Date,
        required: true,
        default: Date.now,
    },
    content: {
        type: String,
        required: true,
    },
});

/**
 * 
 * @param userId 
 * @param targetId 
 * @param message 
 * @description This function is only for internal use. So user as well aw targetUser are guarantee to exist. Thus no more check here
 */
const sendInsiteMessage = async function (userId: string, targetId: string, content: string): Promise<void> {
    const message = new InsiteMessage({
        senderId: userId,
        reciverId: targetId,
        content,
    });
    await message.save();
}

const InsiteMessage = mongoose.model<IInsiteMessage, IInsiteMessageModel>('InsiteMessage', insiteMessageSchema);
export default InsiteMessage;