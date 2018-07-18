import { Request, Response, NextFunction } from 'express';
import Work from '../model/workModel';
import Userwork from '../model/userworkModel';
import _ from 'lodash';
import { ResponseMessage, ErrorMessages } from '../util/utilities';
import fs from 'fs';
import * as config from '../config/userConfig';
export let getAllWorks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const idList = await Work.find({}).distinct('_id');
        return res.status(200).json(new ResponseMessage([], { workIdList: idList }));
    } catch (error) {
        console.log(error);
        return res.status(200).json(new ResponseMessage([ErrorMessages.unknownError]));
    }
}
export let getWorkById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const work = await Work.findById(req.params.workId);
        res.status(200).json(new ResponseMessage([], { work }));
    } catch (error) {
        console.log(error);
        res.status(200).json(new ResponseMessage([ErrorMessages.unknownError]));
    }
}
export let createWork = async (req: Request, res: Response, next: NextFunction) => {
    const work = new Work({
        name: req.body.name,
        description: req.body.description,
        episodes: req.body.episodes,
    });
    const errors: ErrorMessages[] = [];
    if (await Work.findOne({ name: req.body.name })) errors.push(ErrorMessages.workNameExist);
    if (errors.length === 0) {
        await work.save();
        res.status(200).json(new ResponseMessage([], { work }));
    } else res.status(200).json(new ResponseMessage(errors));
}
export let updateById = async (req: Request, res: Response, next: NextFunction) => {
    let errors: ErrorMessages[] = [];
    const workId = req.params.workId;
    const newWork = req.body.work;
    let targetWork;
    let namedWork;
    try {
        [targetWork, namedWork] = await Promise.all([
            Work.findById(workId).exec(),
            Work.find({ name: newWork.name }).exec(),
        ]);
        if (namedWork.filter((value) => { value._id !== workId }).length !== 0) errors.push(ErrorMessages.workNameExist);
        if (!targetWork) errors.push(ErrorMessages.workNotExist);
        if (errors.length === 0) {
            // targetWork.name = req.body.name || targetWork.name;
            // targetWork.description = req.body.description || targetWork.description;
            // await targetWork.save();
            Object.assign(targetWork, newWork);
            await targetWork.save();
        }
    } catch (error) {
        console.log(error);
        errors.push(ErrorMessages.unknownError)
    }
    if (errors.length === 0) {
        return res.status(200).json(new ResponseMessage([], { targetWork }));
    } else {
        return res.status(200).json(new ResponseMessage(errors));
    }
}
export let deleteById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deleted = await Work.findByIdAndRemove(req.params.workId);
        if (!deleted) return res.status(200).json(new ResponseMessage([ErrorMessages.workNotExist]));
        return res.status(200).json(new ResponseMessage());
    } catch (error) {
        console.log(error);
        return res.status(200).json(new ResponseMessage([ErrorMessages.unknownError]));
    }
}
export let like = async (req: Request, res: Response) => {
    try {
        const result = await Userwork.setLike(req.user.id, req.params.workId, true);
        return res.status(200).json(new ResponseMessage());
    } catch (error) {
        console.log(error);
        return res.status(200).json(new ResponseMessage([ErrorMessages.unknownError]));
    }
}
export let unlike = async (req: Request, res: Response) => {
    try {
        const result = await Userwork.setLike(req.user.id, req.params.workId, false);
        return res.status(200).json(new ResponseMessage());
    } catch (error) {
        console.log(error);
        return res.status(200).json(new ResponseMessage([ErrorMessages.unknownError]));
    }
}
export let getlike = async (req: Request, res: Response) => {
    try {
        const workId = req.params.workId;
        const userId = req.user.id;
        const target = await Userwork.findOne({ workId, userId });
        const like = !(target == null || target.like == false);
        return res.status(200).json(new ResponseMessage([], { like }));
    } catch (error) {
        console.log(error);
        return res.status(200).json(new ResponseMessage([ErrorMessages.unknownError]));
    }
}
export let rate = async (req: Request, res: Response, next: NextFunction) => {
    const rating: string = req.body.rating;
    try {
        let userwork = await Userwork.findOne({ userId: req.user.id, workId: req.body.workId });
        if (!userwork) {
            userwork = new Userwork({
                userId: req.user.id,
                workId: req.body.workId,
                rating,
            });
            await userwork.save();
        } else {
            await userwork.set('rating', rating);
        }
        return res.status(200).json(new ResponseMessage());
    } catch (error) {
        return res.status(200).json(new ResponseMessage([ErrorMessages.unknownError]));
    }
}
export let addComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let comment = {
            username: req.user.username,
            workId: req.params.workId,
            userId: req.user.id,
            content: req.body.content,
            time: new Date(),
        }
        let work = await Work.findById(req.params.workId);
        work.comments.push(comment);
        await work.save();
        return res.status(200).json(new ResponseMessage());
    } catch (error) {
        console.log(error);
        return res.status(200).json(new ResponseMessage([ErrorMessages.unknownError]));
    }
}
export let getComments = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let work = await Work.findById(req.params.workId);
        return res.status(200).json(new ResponseMessage([], {
            comments: work.comments,
        }));
    } catch (error) {
        console.log(error);
        return res.status(200).json(new ResponseMessage([ErrorMessages.unknownError]));
    }
}
export let getTags = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let work = await Work.findById(req.params.workId);
        return res.status(200).json(new ResponseMessage([], {
            tags: work.tags,
        }));
    } catch (error) {
        console.log(error);
        return res.status(200).json(new ResponseMessage([ErrorMessages.unknownError]));
    }
}
export let addTag = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const newTag = req.body.newTag || "";
        let work = await Work.findById(req.params.workId);
        if (newTag.length == 0 || work.tags.includes(newTag)) {
            return res.status(200).json(new ResponseMessage([ErrorMessages.illegalOperation]));
        }
        work.tags.push(newTag);
        work.save();
        return res.status(200).json(new ResponseMessage([]));
    } catch (error) {
        console.log(error);
        return res.status(200).json(new ResponseMessage([ErrorMessages.unknownError]));
    }
}
export let removeTag = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const targetTag = req.body.targetTag || "";
        let work = await Work.findById(req.params.workId);
        if (targetTag.length == 0 || !work.tags.includes(targetTag)) {
            return res.status(200).json(new ResponseMessage([ErrorMessages.illegalOperation]));
        }
        //
        _.pull(work.tags, targetTag);
        work.save();
        return res.status(200).json(new ResponseMessage([]));
    } catch (error) {
        console.log(error);
        return res.status(200).json(new ResponseMessage([ErrorMessages.unknownError]));
    }
}
export let createMetadata = async (req: Request, res: Response, next: NextFunction) => {
    const workId = req.params.workId;
    const key = req.body.key;
    const value = req.body.value;
    try {
        const work = await Work.findById(workId);
        if (work.metadata.map(meta => meta.key).includes(key)) {
            res.status(200).json(new ResponseMessage([ErrorMessages.illegalOperation]));
        } else {
            work.metadata.push({ key, value });
            work.save();
            res.status(200).json(new ResponseMessage());
        }
    } catch (error) {
        console.log(error);
        res.status(200).json(new ResponseMessage([ErrorMessages.unknownError]));
    }
}
export let updateMetadata = async (req: Request, res: Response, next: NextFunction) => {
    const workId = req.params.workId;
    const targetKey = req.body.key;
    const newValue = req.body.value;
    try {
        const work = await Work.findById(workId);
        //
        work.metadata.forEach(meta => {
            if (meta.key == targetKey) meta.value = newValue;
        });
        work.save();
        res.status(200).json(new ResponseMessage());
    } catch (error) {
        console.log(error);
        res.status(200).json(new ResponseMessage([ErrorMessages.unknownError]));
    }
}
export let removeMetadata = async (req: Request, res: Response, next: NextFunction) => {
    const workId = req.params.workId;
    const targetKey = req.body.key;
    try {
        const work = await Work.findById(workId);
        _.remove(work.metadata, meta => meta.key == targetKey);
        work.save();
    } catch (error) {
        console.log(error);
        return res.status(200).json(new ResponseMessage([ErrorMessages.unknownError]));
    }
}
export let getMetaDatas = async (req: Request, res: Response, next: NextFunction) => {
    const workId = req.params.workId;
    const targetKey = req.body.key;
    try {
        const work = await Work.findById(workId);
        return res.status(200).json(new ResponseMessage([], {
            metadata: work.metadata,
        }));
    } catch (error) {
        console.log(error);
        return res.status(200).json(new ResponseMessage([ErrorMessages.unknownError]));
    }
}
export let uploadCover = async (req: Request, res: Response, next: NextFunction) => {
    const workId = req.params.workId;
    const cover = req.file;
    if (!req.file) return res.status(200).json(new ResponseMessage([ErrorMessages.illegalOperation]));
}
export let getCover = async (req: Request, res: Response, next: NextFunction) => {
    const workId = req.params.workId;
    const filePath = config.UPLOAD_PATH + '/work/cover/' + workId;
    try {
        const cover = await fs.exists(filePath, null);
        if (cover) {
            return res.status(200).sendFile(filePath);
        }
        return res.status(200).json(new ResponseMessage([ErrorMessages.unknownError]));
    } catch (error) {
        console.log(error);
        return res.status(200).json(new ResponseMessage([ErrorMessages.unknownError]));
    }
}
export let setWatched = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.id;
    const workId = req.params.workId;
    const watched = req.body.watched;
    try {
        let userwork = await Userwork.findOne({ userId, workId });
        if (!userwork) {
            userwork = new Userwork({
                userId,
                workId,
                watched,
            });
        }
        await userwork.save();
        return res.status(200).json(new ResponseMessage([]));
    } catch (error) {
        console.log(error);
        return res.status(200).json(new ResponseMessage([ErrorMessages.unknownError]));
    }
}
export let setRate = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.id;
    const workId = req.params.workId;
    const rate = req.body.rate;
    try {
        let userwork = await Userwork.findOne({ userId, workId });
        if (!userwork) {
            userwork = new Userwork({
                userId,
                workId,
                rate,
            });
        }
        await userwork.save();
        return res.status(200).json(new ResponseMessage([]));
    } catch (error) {
        console.log(error);
        return res.status(200).json(new ResponseMessage([ErrorMessages.unknownError]));
    }
}
export let search = async (req: Request, res: Response, next: NextFunction) => {
    const keyword = req.params.q;
    try {
        const workIds = await Work.find({
            $text: { $search: "keyword" }
        }).distinct('id');
        return res.status(200).json(new ResponseMessage([], { workIds }))
    } catch (error) {
        console.log(error);
        return res.status(200).json(new ResponseMessage([ErrorMessages.unknownError]));
    }
}
