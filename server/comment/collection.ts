import type {HydratedDocument, Types, FilterQuery} from 'mongoose';
import FreetCollection from '../freet/collection';
import type {Comment} from './model';
import CommentModel from './model';

/**
 * This files contains a class that has the functionality to explore comments
 * stored in MongoDB, including adding, finding, updating, and deleting comments.
 * Feel free to add additional operations in this file.
 */
class CommentCollection {
  /**
   * Add a comment to the collection
   *
   * @param {string} authorId - The id of the author of the comment
   * @param {string} content - The id of the content of the comment
   * @param {string} freetId - The id of the freet being engaged with
   * @param {string|undefined} commentId - The id of the parent comment
   * @param {boolean} isPrivate - Whether the comment should be private.
   * @return {Promise<HydratedDocument<Comment>>} - The newly created comment
   */
  static async addOne(authorId: Types.ObjectId | string, content: string, freetId: Types.ObjectId | string, commentId: Types.ObjectId | string | undefined, isPrivate: boolean): Promise<HydratedDocument<Comment>> {
    const date = new Date();
    const comment = new CommentModel({
      authorId,
      content,
      isPrivate,
      parentFreet: freetId,
      parentComment: commentId,
      dateCreated: date,
      dateModified: date
    });
    await comment.save(); // Saves freet to MongoDB
    return comment.populate('authorId');
  }

  /**
   * Find a comment by commentId
   *
   * @param {string} commentId - The id of the comment to find
   * @return {Promise<HydratedDocument<Comment>> | Promise<null> } - The comment with the given commentId, if any
   */
  static async findOne(freetId: Types.ObjectId | string): Promise<HydratedDocument<Comment>> {
    return CommentModel.findOne({_id: freetId});
  }

  /**
   * Get all the comments in with a given source. If the user requesting the comments is not the freet author, 
   *
   * @param {string} parentFreet - The id of the parent freet
   * @param {string|undefined} user - The user requesting the data
   * @return {Promise<HydratedDocument<Comment>[]>} - An array of all of the comments
   */
  static async findAllByFreet(parentFreet: Types.ObjectId | string, user: Types.ObjectId | string | undefined): Promise<Array<HydratedDocument<Comment>>> {
    const freet = await FreetCollection.findOne(parentFreet);
    const freetAuthor = freet.authorId._id;
    const conditions: FilterQuery<Comment>[] = [
        {parentFreet, isPrivate: false, parentComment: {$exists: false}}, 
        {parentFreet, isPrivate: true, authorId: user, parentComment: {$exists: false}},
    ];
    // freetAuthors can see all private posts
    if (user && freetAuthor.toString() === user.toString()) {
        console.log("author");
        conditions.push({parentFreet, isPrivate: true, parentComment: {$exists: false}, authorId: {$exists: true}});
    }
    return CommentModel.find({$or: conditions})
      .populate(['authorId', 'replies'])
      .populate({path:'replies', populate: [{path:'replies'},{path: 'authorId'}]});
  }

  /**
   * Get all the comments in with a given source
   *
   * @param {string} parentFreet - The id of the parent freet
   * @param {string | undefined} user - The user requesting the data
   * @param {boolean} isPrivate - Whether to filter for private comments or public comments
   * @return {Promise<HydratedDocument<Comment>[]>} - An array of all of the comments
   */
  static async findAllByFreetAndVisibility(parentFreet: Types.ObjectId | string, user: Types.ObjectId | string | undefined, isPrivate: boolean): Promise<Array<HydratedDocument<Comment>>> {
    const freet = await FreetCollection.findOne(parentFreet);
    const freetAuthor = freet.authorId._id;
    const conditions: FilterQuery<Comment>[] = [
        {parentFreet, isPrivate, authorId: user, parentComment: {$exists: false}},
    ];
    // freetAuthors can see all private posts
    if (!isPrivate || (user && user.toString() == freetAuthor.toString())) {
        conditions.push({parentFreet, isPrivate, parentComment: {$exists: false}, authorId: {$exists: true}});
    }
    return CommentModel.find({$or: conditions})
      .populate(['authorId', 'replies'])
      .populate({path:'replies', populate: [{path:'replies'},{path: 'authorId'}]});
  }

  /**
   * Update a comment with the new content
   *
   * @param {string} commentId - The id of the comment to be updated
   * @param {string} content - The new content of the freet
   * @return {Promise<HydratedDocument<Comment>>} - The newly updated comment
   */
  static async updateOne(commentId: Types.ObjectId | string, content: string): Promise<HydratedDocument<Comment>> {
    const comment = await CommentModel.findOne({_id: commentId})
        .populate(['authorId', 'replies'])
        .populate({path:'replies', populate: [{path:'replies'},{path: 'authorId'}]});
    comment.content = content;
    comment.dateModified = new Date();
    await comment.save();
    return comment;
  }

  /**
   * Delete a comment with given commentId.
   * 
   * @param {string} commentId - The commentId of comment to delete
   * @return {Promise<Boolean>} - true if the comment has been deleted, false otherwise
   */
  static async deleteOne(commentId: Types.ObjectId | string): Promise<boolean> {
    const comment = await CommentModel.deleteOne({_id: commentId});
    return comment !== null;
  }
}

export default CommentCollection;
