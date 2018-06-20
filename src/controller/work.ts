import { Request, Response, NextFunction } from 'express';
import Work, { WorkModel } from '../model/workModel';
import { userInfo, endianness } from 'os';

export let getAllWork = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const idList = await Work.find({}).distinct('_id');
        res.status(200).json({
            ids: idList,
        });
    } catch (error) {
        console.log(error);
        res.status(400).end();
    }
}
export let getWorkById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const work = await Work.findById(req.params.id);
        res.status(200).json(work);
    } catch (error) {
        console.log(error);
        res.status(200).end();
    }
}

export let add = async (req: Request, res: Response, next: NextFunction) => {
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
            existringName: true,
        })
    }
}

export let updateById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const newWork = await Work.findByIdAndUpdate(req.body.id, req.body.update, {
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
        const deleted = await Work.findByIdAndRemove(req.body.id);
        res.status(200).json({
            success: true,
        });
    } catch (error) {
        console.log(error);
        res.status(200).json({
            success: false,
        });
    }
}