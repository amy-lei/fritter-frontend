import type {Request, Response, NextFunction} from 'express';
import { reactionTypes, ReactionType } from './model';
import {Types} from 'mongoose';
import ReactionCollection from './collection';

/**
 * Checks if a reaction with reactionId is req.params exists
 */
const isReactionExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.reactionId);
  const reaction = validFormat ? await ReactionCollection.findOne(req.params.reactionId) : '';
  if (!reaction) {
    res.status(404).json({
      error: `Reaction with ID ${req.params.reactionId} does not exist.`
    });
    return;
  }

  next();
};

/**
 * Checks if the reaction type is supported.
 */
const isValidReactionType = (req: Request, res: Response, next: NextFunction) => {
  const {type} = req.body as {type: string};
  if (!type.trim()) {
    res.status(400).json({
      error: 'Reaction type must be specified.'
    });
    return;
  }

  if (!reactionTypes.includes(type as ReactionType)) {
    res.status(400).json({
      error: `'${type}' is an unsupported reaction type.`
    });
    return;
  }

  next();
};


/**
 * Checks if the current user is the issuer of the reaction on the given freet
 */
const isValidReaactionModifier = async (req: Request, res: Response, next: NextFunction) => {
  const reaction = await ReactionCollection.findOne(req.params.reactionId);
  const userId = reaction.issuerId._id;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot modify other users\' reactions.'
    });
    return;
  }

  next();
};

export {
  isValidReactionType,
  isReactionExists,
  isValidReaactionModifier
};
