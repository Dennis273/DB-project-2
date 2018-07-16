import Article from '../model/articleModel';
import { Request, Response, NextFunction } from 'express';
import { ResponseMessage, ErrorMessages } from '../util/utilities';
export let newArticle = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.id;
    const username = req.user.name;
    const content = req.body.article.content;
    const title = req.body.title;
    const time = Date.now;
    if (!title || !content) return res.status(200).json(new ResponseMessage([ErrorMessages.illegalOperation]));

    try {
        const article = new Article({
            userId, username, content, title, time,
        });
        await article.save();
        return res.status(200).json(new ResponseMessage([]));
    } catch (error) {
        console.log(error);
        return res.status(200).json(new ResponseMessage([ErrorMessages.unknownError]));
    }
}
export let getAllArticleId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const articleIds = await Article.find({}).distinct('id');
        return res.status(200).json(new ResponseMessage([], { articleIds }));
    } catch (error) {
        console.log(error);
        return res.status(200).json(new ResponseMessage([ErrorMessages.unknownError]));
    }
}
export let getOwnArticleId = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.userId;
    try {
        const articleIds = await Article.find({ userId }).distinct('id');
        return res.status(200).json(new ResponseMessage([], { articleIds }));
    } catch (error) {
        console.log(error);
        return res.status(200).json(new ResponseMessage([ErrorMessages.unknownError]));
    }
}
export let getArticleById = async (req: Request, res: Response, next: NextFunction) => {
    const articleId = req.params.articleId;
    try {
        const article = await Article.findById(articleId);
        return res.status(200).json(new ResponseMessage([], { article }));
    } catch (error) {
        console.log(error);
        return res.status(200).json(new ResponseMessage([ErrorMessages.unknownError]));
    }
}
export let deleteArticleById = async (req: Request, res: Response, next: NextFunction) => {
    const articleId = req.params.articleId;
    try {
        const article = await Article.findByIdAndRemove(articleId);
        return res.status(200).json(new ResponseMessage([]));
    } catch (error) {
        console.log(error);
        return res.status(200).json(new ResponseMessage([ErrorMessages.unknownError]));
    }
}