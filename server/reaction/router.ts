import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import ReactionCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as reactionValidator from './middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get all the reactions for a freet.
 *
 * @name GET /api/reactions
 *
 * @return {FreetResponse[]} - An array of all reactions
 *
 */
/**
 * Get all the reactions for a freet.
 *
 * @name GET /api/reactions?freetId=id
 *
 * @return {FreetResponse[]} - An array of reactions associated with freet id
 * @throws {400} - If freetId is not given
 * @throws {404} - If no freet has given freetId
 *
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.query.freetId !== undefined) {
      next();
      return;
    }
    const allReacts = await ReactionCollection.findAll();
    const response = allReacts.map(util.constructReactionResponse);
    res.status(200).json(response);
  },
  [
    freetValidator.isQueryFreetExists
  ],
  async (req: Request, res: Response) => {
    const freetId = req.query.freetId as string;
    const allReactions = await ReactionCollection.findAllByFreetId(freetId);
    const response = allReactions.map(util.constructReactionResponse);
    res.status(200).json(response);
  }
);

/**
 * Add or updates reaction to freet.
 *
 * @name PUT /api/reactions
 *
 * @param {string} type - The type of reaction
 * @param {string} freetId - The id of the freet being reacted to
 * @return {FreetResponse} - The created freet
 * @throws {403} - If the user is not logged in
 * @throws {400} - If freetId or type were not specified. Or if the type is not supported
 * @throws {404} - If no freet has given freetId
 */
router.put(
  '/',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isBodyFreetExists,
    reactionValidator.isValidReactionType,
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.session.userId as string) ?? '';
    let reaction = await ReactionCollection.findOneWithSourceAndIsssuer(req.body.freetId, userId);
    if (!reaction) {
      next();
      return;
    }
    reaction.type = req.body.type;
    await reaction.save();
    res.status(201).json({
      message: 'Your reaction was upated successfully.',
      freet: util.constructReactionResponse(reaction)
    });
  },
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.session.userId as string) ?? '';
    const reaction = await ReactionCollection.addOne(userId, req.body.freetId, req.body.type);
    res.status(200).json({
      message: 'Your reaction was added successfully.',
      freet: util.constructReactionResponse(reaction)
    });
  },
);

/**
 * Remove a reaction from a freet
 *
 * @name DELETE /api/reactions/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the freet
 * @throws {404} - If the freetId is not valid
 */
router.delete(
  '/:reactionId?',
  [
    userValidator.isUserLoggedIn,
    reactionValidator.isReactionExists,
    reactionValidator.isValidReaactionModifier
  ],
  async (req: Request, res: Response) => {
    await ReactionCollection.deleteOne(req.params.reactionId);
    res.status(200).json({
      message: 'Your reaction was removed successfully.'
    });
  }
);

export {router as reactionRouter};
