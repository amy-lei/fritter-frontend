import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import BlockCollection from './collection';
import * as userValidator from '../user/middleware';
import * as blockValidator from './middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get all the block made by the logged in user
 *
 * @name GET /api/blocks
 *
 * @return {BlockResponse[]} - A list of all the blocks associated with logged in user
 * @throws {403} - If user is not logged in 
 */
router.get(
  '/',
  [
    userValidator.isUserLoggedIn,
  ],
  async (req: Request, res: Response) => {
    const allBlocks = await BlockCollection.findAllByBlocker(req.session.userId as string);
    const response = allBlocks.map(util.constructBlockResponse);
    res.status(200).json(response);
  },
);

/**
 * Add a new block.
 *
 * @name POST /api/blocks
 *
 * @param {string} blockee - The id of the user being blocked
 * @return {BlockResponse} - The created block
 * @throws {403} - If the user is not logged in
 * @throws {400} - If no blockee was given, the blockee is the logged in user, or
 *                 the block already exists
 * @throws {404} - If no user has the specified blockee id
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    blockValidator.isValidBlock,
    blockValidator.isBlockRelationDupe,
  ],
  async (req: Request, res: Response) => {
    const block = await BlockCollection.addOne(req.session.userId, req.body.blockee);
    res.status(201).json({
      message: 'Your block was created successfully.',
      freet: util.constructBlockResponse(block)
    });
  }
);

/**
 * Delete a block
 *
 * @name DELETE /api/blocks/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the blocker
 * @throws {404} - If the blockId is not valid
 */
router.delete(
  '/:blockId?',
  [
    userValidator.isUserLoggedIn,
    blockValidator.isBlockExist,
    blockValidator.isValidModifier,
  ],
  async (req: Request, res: Response) => {
    await BlockCollection.deleteOne(req.params.blockId);
    res.status(200).json({
      message: 'Your block was deleted successfully.'
    });
  }
);

export {router as blockRouter};
