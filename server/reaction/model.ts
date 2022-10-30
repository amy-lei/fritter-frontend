import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

/**
 * This file defines the properties stored in a Tag
 */

export enum ReactionType {
  LOVE = 'LOVE',
  HAHA = 'HAHA',
  SAD = 'SAD',
  ANGRY = 'ANGRY',
  LIKE = 'LIKE',
  DISLIKE = 'DISLIKE',
};

// Type definition for Tag on the backend
export type Reaction = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  issuerId: Types.ObjectId;
  source: Types.ObjectId;
  type: ReactionType;
};
              
export type PopulatedReaction = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  issuerId: User;
  source: Types.ObjectId;
  type: ReactionType;
};          

export const reactionTypes: ReactionType[] = [
  ReactionType.LOVE,
  ReactionType.HAHA,
  ReactionType.SAD,
  ReactionType.ANGRY,
  ReactionType.LIKE,
  ReactionType.DISLIKE,
];

const ReactionSchema = new Schema<Reaction>({
  // The issuer userId
  issuerId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // The content being reacted to
  source: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  // The reaction type
  type: {
    type: String,
    enum: reactionTypes,
    required: true
  },
},
{
  toJSON: { virtuals: true },
}
);

ReactionSchema.virtual('Freet', {
  ref: 'Freet',
  localField: 'source',
  foreignField: '_id',
  justOne: true,
});

ReactionSchema.index({ issuerId: 1, source: 1 }, { unique: true });

const ReactionModel = model<Reaction>('Reaction', ReactionSchema);
export default ReactionModel;
