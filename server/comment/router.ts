import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import CommentCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as commentValidator from './middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get comments by freet or comment.
 *
 * @name GET /api/comments?freetId=id&visibility=type
 *
 * @return {CommentResponse[]} - An array of comments created made in response to freet
 *                               with id, freetId
 * @throws {400} - If freetId is not given
 * @throws {400} - If visibility was provided but is not either 'public' or 'private'
 * @throws {404} - If no freet has given id
 *
 */
router.get(
  '/',
  [
    freetValidator.isQueryFreetExists,
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.query.visibility !== undefined) {
      next();
      return;
    }
    const allComments = await CommentCollection.findAllByFreet(req.query.freetId as string, req.session.userId);
    const response = allComments.map(util.constructCommentResponse);
    res.status(200).json(response);
  },
  [
    commentValidator.isValidVisibility,
  ],
  async (req: Request, res: Response) => {
    const isPrivate = (req.query.visibility as string).toLowerCase() === 'private';
    const allComments = await CommentCollection.findAllByFreetAndVisibility(req.query.freetId as string, req.session.userId, isPrivate);
    const response = allComments.map(util.constructCommentResponse);
    res.status(200).json(response);
  },
);

/**
 * Create a new comment.
 *
 * @name POST /api/comments
 *
 * @param {string} content - The content of the freet
 * @param {string} freetId - The id of the freet being engaged with
 * @param {string} visibility - The visibility of the comment.
 * @return {CommentResponse} - The created comment
 * @throws {400} - If freetId was not provided
 * @throws {400} - If the comment content is empty or a stream of empty spaces
 * @throws {400} - If visibility is not either 'public' or 'private'
 * @throws {403} - If the user is not logged in
 * @throws {404} - If no freet has given id
 * @throws {413} - If the comment content is more than 140 characters long
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isBodyFreetExists,
    commentValidator.isValidVisibility,
    commentValidator.isValidCommentContent,
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const comment = await CommentCollection.addOne(
        userId, req.body.content, req.body.freetId, undefined, req.body.visibility === 'private');

    res.status(201).json({
      message: 'Your freet was created successfully.',
      freet: util.constructCommentResponse(comment)
    });
  }
);
/**
 * Create a new comment as a reply. The visibility is adapted from the parent comment.
 *
 * @name POST /api/comments/replies
 *
 * @param {string} content - The content of the freet
 * @param {string} commentId - The id of the comment being responded to
 * @return {CommentResponse} - The created comment
 * @throws {400} - If the comment content is empty or a stream of empty spaces
 * @throws {403} - If the user is not logged in
 * @throws {404} - If no comment has given id
 * @throws {413} - If the comment content is more than 140 characters long
 */
 router.post(
  '/replies',
  [
    userValidator.isUserLoggedIn,
    commentValidator.isCommentExist,
    commentValidator.isValidCommentContent,
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const parent = await CommentCollection.findOne(req.body.commentId);
    const comment = await CommentCollection.addOne(
        userId, req.body.content, parent.parentFreet, req.body.commentId, parent.isPrivate);

    res.status(201).json({
      message: 'Your freet was created successfully.',
      freet: util.constructCommentResponse(comment)
    });
  }
);

/**
 * Delete a comment
 *
 * @name DELETE /api/comments/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the comment
 * @throws {404} - If the commentId is not valid
 */
router.delete(
  '/:commentId?',
  [
    userValidator.isUserLoggedIn,
    commentValidator.isCommentExist,
    commentValidator.isValidCommentModifier,
  ],
  async (req: Request, res: Response) => {
    await CommentCollection.deleteOne(req.params.commentId);
    res.status(200).json({
      message: 'Your comment was deleted successfully.'
    });
  }
);

/**
 * Modify a comment
 *
 * @name PUT /api/comments/:id
 *
 * @param {string} content - the new content for the comment
 * @return {FreetResponse} - the updated comment
 * @throws {403} - if the user is not logged in or not the author of
 *                 of the comment
 * @throws {404} - If the commentId is not valid
 * @throws {400} - If the comment content is empty or a stream of empty spaces
 * @throws {413} - If the comment content is more than 140 characters long
 */
router.put(
  '/:commentId?',
  [
    userValidator.isUserLoggedIn,
    commentValidator.isCommentExist,
    commentValidator.isValidCommentModifier,
    commentValidator.isValidCommentContent,
  ],
  async (req: Request, res: Response) => {
    const freet = await CommentCollection.updateOne(req.params.commentId, req.body.content);
    res.status(200).json({
      message: 'Your comment was updated successfully.',
      freet: util.constructCommentResponse(freet)
    });
  }
);

export {router as commentRouter};
