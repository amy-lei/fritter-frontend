import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import { User } from '../user/model';

/**
 * This file defines the properties stored in a Freet
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Block on the backend
export type Block = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  blocker: Types.ObjectId;
  blockee: Types.ObjectId;
};
export type PopulatedBlock = {
  _id: Types.ObjectId;
  blocker: User;
  blockee: User;
};

const BlockSchema = new Schema<Block>({
  // the initiator of the block
  blocker: {
    ref: 'User',
    type: Schema.Types.ObjectId,
    required: true,
  },
  // the person being blocked
  blockee: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
},
{
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
}
);

BlockSchema.index({ blocker: 1, blockee: 1 }, { unique: true });

const BlockModel = model<Block>('Block', BlockSchema);
export default BlockModel;
