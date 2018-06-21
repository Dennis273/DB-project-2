import { Request, Response, NextFunction } from 'express';
import Work from '../model/workModel';
import { userInfo, endianness } from 'os';
import Userwork from '../model/userworkModel';

export let getAllWork = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const idList = await Work.find({}).distinct('_id');
        return res.status(200).json({
            workIds: idList,
        });
    } catch (error) {
        console.log(error);
        return res.status(400).end();
    }
}
export let getWorkById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const work = await Work.findById(req.params.workId);
        res.status(200).json(work);
    } catch (error) {
        console.log(error);
        res.status(200).end();
    }
}

export let create = async (req: Request, res: Response, next: NextFunction) => {
    const work = new Work({
        name: req.body.name,
        description: req.body.description,
    });
    const existringName = await Work.findOne({ name: req.body.name });
    if (!existringName) {
        await work.save();
        res.status(200).json({
            success: true,
            workId: work._id,
        })
    } else {
        res.status(200).json({
            success: false,
            existingName: true,
        })
    }
}

export let updateById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const newWork = await Work.findByIdAndUpdate(req.params.workId, req.body.update, {
            runValidators: true,
            new: true,
        });

        res.status(200).json({
            success: true,
        });
    } catch (error) {
        console.log(error);
        res.status(200).json({
            success: false,
        })
    }
}
export let deleteById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deleted = await Work.findByIdAndRemove(req.params.workId);
        res.status(200).json({
            success: true,
        });
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            success: false,
        });
    }
}

export let like = async (req: Request, res: Response) => {
    try {
        const result = await Userwork.setLike(req.user._id, req.params.workId, true);
        return res.status(200).json({
            success: result,
        });
    } catch (error) {
        console.log(error);
        return res.status(422).json({
            success: false,
        });
    }
}
export let unlike = async (req: Request, res: Response) => {
    try {
        const result = await Userwork.setLike(req.user._id, req.params.workId, false);
        return res.status(200).json({
            success: result,
        });
    } catch (error) {
        console.log(error);
        return res.status(422).json({
            success: false,
        });
    }
}
export let rate = async (req: Request, res: Response, next: NextFunction) => {
    const rating: string = req.body.rating;
    try {
        let userwork = await Userwork.findOne({ userId: req.user._id, workId: req.body.workId });
        if (!userwork) {
            userwork = new Userwork({
                userId: req.user._id,
                workId: req.body.workId,
                rate: rating,
            });
            await userwork.save();
        } else {
            await userwork.set('rate', rating);
        }
        return res.status(200).end({
            success: true,
        });
    } catch (error) {
        return res.status(400).end({
            success: false,
        });
    }
}