import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Comment, PopulatedComment} from './model';

type CommentResponse = {
  _id: string;
  author: string;
  parentComment: string;
  parentFreet: string;
  content: string;
  isPrivate: boolean;
  dateCreated: string;
  dateModified: string;
  replies: CommentResponse[];
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

const constructComment = (comment: PopulatedComment): CommentResponse => {
  const {username} = comment.authorId;
  delete comment.authorId;
  return {
    ...comment,
    _id: comment._id.toString(),
    author: username,
    parentComment: comment.parentComment?.toString(),
    parentFreet: comment.parentFreet.toString(),
    dateCreated: formatDate(comment.dateCreated),
    dateModified: formatDate(comment.dateModified),
    replies: (comment.replies || []).map(constructComment),
  };
}

/**
 * Transform a raw Comment object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Comment>} comment - A comment
 * @returns {CommentResponse} - The comment object formatted for the frontend
 */
const constructCommentResponse = (comment: HydratedDocument<Comment>): CommentResponse => {
  const commentCopy: PopulatedComment = {
    ...comment.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  return constructComment(commentCopy);
};

export {
    constructCommentResponse
};
