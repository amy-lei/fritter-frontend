import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import CommentCollection from './collection';


const isValidVisibility = async (req: Request, res: Response, next: NextFunction) => {
    const method = req.method;
    let visibility  = method === 'GET' ? req.query.visibility as string : req.body.visibility;
    if (visibility === undefined) {
        next();
        return;
    }
    visibility = visibility.toLowerCase();
    if (visibility !== 'private' && visibility !== 'public') {
        res.status(400).json({
            error: `Visibility needs to be 'public' or 'private'. Was provided ${visibility} instead`
        });
        return;
    }
    next();
} 
const getIdData = (req: Request) => {
    switch (req.method) {
        case 'PUT':
        case 'DELETE':
            return req.params;
        case 'POST':
            return req.body;
        case 'GET':
        default:
            return req.query;
    }
}
/**
 * Checks if the comment exists, if specified
 */
 const isCommentExist = async (req: Request, res: Response, next: NextFunction) => {
    const commentId = getIdData(req).commentId as string;
    const isValid = Types.ObjectId.isValid(commentId);
    const comment = isValid ? await CommentCollection.findOne(commentId) : undefined;
    if (!comment) {
      res.status(400).json({
        error: `Comment with id '${commentId}' was not exist.`
      });
      return;
    }
  
    next();
};

/**
 * Checks if the current user is the author of the comment whose commentId is in req.params
 */
 const isValidCommentModifier = async (req: Request, res: Response, next: NextFunction) => {
    const comment = await CommentCollection.findOne(req.params.commentId);
    const userId = comment.authorId._id;
    if (req.session.userId !== userId.toString()) {
      res.status(403).json({
        error: 'Cannot modify other users\' comments.'
      });
      return;
    }
  
    next();
};

/**
 * Checks if the content of the freet in req.body is valid, i.e not a stream of empty
 * spaces and not more than 140 characters
 */
 const isValidCommentContent = (req: Request, res: Response, next: NextFunction) => {
    const {content} = req.body as {content: string};
    if (!content.trim()) {
      res.status(400).json({
        error: 'Comment content must be at least one character long.'
      });
      return;
    }
  
    if (content.length > 140) {
      res.status(413).json({
        error: 'Comment content must be no more than 140 characters.'
      });
      return;
    }
  
    next();
  };

export {
  isValidVisibility,
  isCommentExist,
  isValidCommentModifier,
  isValidCommentContent,
};
