import type {HydratedDocument} from 'mongoose';
import type {Block, PopulatedBlock} from './model';

type BlockResponse = {
  _id: string;
  blocker: string;
  blockee: string;
};

/**
 * Transform a raw Block object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Block>} block - A block
 * @returns {FreetResponse} - The block object formatted for the frontend
 */
const constructBlockResponse = (block: HydratedDocument<Block>): BlockResponse => {
  const blockCopy: PopulatedBlock = {
    ...block.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
    
  };
  const blockerUsername = blockCopy.blocker.username;
  const blockeeUsername = blockCopy.blockee.username;
  delete blockCopy.blocker;
  delete blockCopy.blockee;

  return {
    _id: blockCopy._id.toString(),
    blocker: blockerUsername,
    blockee: blockeeUsername,
  };
};

export {
  constructBlockResponse
};
