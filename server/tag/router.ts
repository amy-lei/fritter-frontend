import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import TagCollection from './collection';
import * as userValidator from '../user/middleware';
import * as tagValidator from './middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get all the tags associated with an item
 *
 * @name GET /api/tags?source=id
 *
 * @return {TagResponse[]} - A list of all the tags associated with item
 * @throws {400} - If source is not given
 * @throws {404} - If no item has given id
 */
router.get(
  '/',
  [
    tagValidator.isValidSource,
  ],
  async (req: Request, res: Response) => {
    const allFreets = await TagCollection.findAllBySource(req.query.source as string);
    const response = allFreets.map(util.constructTagResponse);
    res.status(200).json(response);
  },
);

/**
 * Add a new tag.
 *
 * @name POST /api/tag
 *
 * @param {string} source - The id of the item to be tagging
 * @param {string} label - The text of the freet
 * @return {TagResponse} - The created tag
 * @throws {403} - If the user is not logged in or is trying to add a tag to someone else's profile/freet
 * @throws {400} - If the tag label is empty or a stream of empty spaces or not aphanumeric
 * @throws {400} - If the tag already exists
 * @throws {400} - If no source was given
 * @throws {404} - If no item has the specified ID
 * @throws {413} - If the tag label is more than 25 characters long
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    tagValidator.isValidSource,
    tagValidator.isValidModifier,
    tagValidator.isValidLabel,
    tagValidator.isNotDuplicate,
  ],
  async (req: Request, res: Response) => {
    const freet = await TagCollection.addOne(req.body.source, req.body.label);
    res.status(201).json({
      message: 'Your tag was created successfully.',
      freet: util.constructTagResponse(freet)
    });
  }
);

/**
 * Delete a tag
 *
 * @name DELETE /api/tags/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the tag
 * @throws {404} - If the tagId is not valid
 */
router.delete(
  '/:tagId?',
  [
    userValidator.isUserLoggedIn,
    tagValidator.isValidModifier,
    tagValidator.isTagExist,
  ],
  async (req: Request, res: Response) => {
    await TagCollection.deleteOne(req.params.tagId);
    res.status(200).json({
      message: 'Your tag was deleted successfully.'
    });
  }
);

export {router as tagRouter};
