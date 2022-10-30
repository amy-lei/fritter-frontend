import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';

/**
 * This file defines the properties stored in a Freet
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Tag on the backend
export type Tag = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  source: Types.ObjectId;
  label: string;
};

const TagSchema = new Schema<Tag>({
  // The item being tagged
  source: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  // The label associated with the tag
  label: {
    type: String,
    required: true
  },
},
{
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
}
);

TagSchema.virtual('User', {
  ref: 'User',
  localField: 'source',
  foreignField: '_id',
});

TagSchema.virtual('Freet', {
  ref: 'Freet',
  localField: 'source',
  foreignField: '_id',
});

TagSchema.index({ source: 1, label: 1 }, { unique: true });

const TagModel = model<Tag>('Tag', TagSchema);
export default TagModel;
