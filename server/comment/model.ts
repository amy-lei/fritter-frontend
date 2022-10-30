import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

// Type definition for Comment on the backend
export type Comment = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: Types.ObjectId;
  parentComment: Types.ObjectId;
  parentFreet: Types.ObjectId;
  content: string;
  isPrivate: boolean;
  dateCreated: Date;
  dateModified: Date;
  replies?: Array<Types.ObjectId>;
};

export type PopulatedComment = {
  _id: Types.ObjectId;
  authorId: User;
  parentComment: Types.ObjectId;
  parentFreet: Types.ObjectId;
  content: string;
  isPrivate: boolean;
  dateCreated: Date;
  dateModified: Date;
  replies?: Array<PopulatedComment>;
};

const CommentSchema = new Schema<Comment>({
  // The author userId
  authorId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // The id of the comment being responded to
  parentComment: {
    type: Schema.Types.ObjectId,
    ref: 'Comment',
  },
  // The id of the freet being engaged with
  parentFreet: {
    type: Schema.Types.ObjectId,
    ref: 'Freet',
    required: true,
  },
  // The content of the comment
  content: {
    type: String,
    required: true
  },
  // The visibility of the comment
  isPrivate: {
    type: Boolean,
    required: true,
    default: false,
  },
  // The date the comment was created
  dateCreated: {
    type: Date,
    required: true
  },
  // The date the comment was modified
  dateModified: {
    type: Date,
    required: true
  }
},
{
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
}
);

CommentSchema.virtual('replies', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'parentComment',
});


const CommentModel = model<Comment>('Comment', CommentSchema);
export default CommentModel;
