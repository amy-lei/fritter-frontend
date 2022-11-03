import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import UserCollection from '../user/collection';
import BlockCollection from './collection';

/**
 * Checks if the user is allowed to create the block
 */
const isValidModifier = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.session.userId as string;
  const block = await BlockCollection.findOne(req.params.blockId);
  if (block.blocker._id.toString() !== userId) {
    res.status(403).json({
      error: `Logged in user is not the blocker of block ${req.params.blockId}`
    });
    return;
  }
  next();
} 


/**
 * Checks if this block is valid (e.g. between two actual different users)
 */
const isValidBlock = async (req: Request, res: Response, next: NextFunction) => {
  const blocker = req.session.userId;
  const blockee = req.body.blockee;
  if (!blockee) {
    res.status(400).json({
      error: `Blockee cannot be empty`
    });
    return;
  }

  const blockeeUser = await UserCollection.findOneByUsername(blockee);
  if (!blockeeUser) {
    res.status(404).json({
      error: `Cannot find a user with the username ${blockee}`
    });
    return;
  }

  if (blocker === blockeeUser._id) {
    res.status(400).json({
      error: 'Blockee and blocker must be different objects'
    });
    return;
  }
  next();
}

/**
 * Checks if there is a corresponding block for the blockid
 */
const isBlockExist = async (req: Request, res: Response, next: NextFunction) => {
  const blockId = req.params.blockId;
  const validFormat = Types.ObjectId.isValid(blockId);
  const block = validFormat ? await BlockCollection.findOne(blockId) : undefined;
  if (!block) {
    res.status(404).json({
      error: `A block with id ${blockId} was not found`
    });
    return;
  }
  next();
}

/**
 * Checks if there is a corresponding block for the blockid
 */
const isBlockRelationDupe = async (req: Request, res: Response, next: NextFunction) => {
  const blockeeUser = await UserCollection.findOneByUsername(req.body.blockee);
  const block = await BlockCollection.findOneByFields(req.session.userId, blockeeUser._id);
  if (block) {
    res.status(400).json({
      error: `Block between ${req.session.userId} and ${req.body.blockee} already exists`
    });
    return;
  }
  next();
}


export {
  isValidModifier,
  isBlockExist,
  isBlockRelationDupe,
  isValidBlock,
};
