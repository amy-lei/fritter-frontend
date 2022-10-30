import type {HydratedDocument} from 'mongoose';
import type {Reaction, PopulatedReaction} from './model';

// Update this if you add a property to the Reaction type!
type ReactionResponse = {
  _id: string;
  issuer: string;
  source: string;
  type: string;
};

/**
 * Transform a raw Reaction object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Reaction>} reaction - A reaction
 * @returns {ReactionResponse} - The reaction object formatted for the frontend
 */
const constructReactionResponse = (reaction: HydratedDocument<Reaction>): ReactionResponse => {
  const reactionCopy: PopulatedReaction = {
    ...reaction.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {username} = reactionCopy.issuerId;
  delete reactionCopy.issuerId;
  return {
    ...reactionCopy,
    _id: reactionCopy._id.toString(),
    issuer: username,
    source: reactionCopy.source.toString(),
  };
};

export {
    constructReactionResponse
};
