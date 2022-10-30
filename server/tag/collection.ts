import type {HydratedDocument, Types} from 'mongoose';
import type {Tag} from './model';
import TagModel from './model';

/**
 * This files contains a class that has the functionality to explore tags
 * stored in MongoDB, including adding, finding, and deleting freets.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Freet> is the output of the FreetModel() constructor,
 * and contains all the information in Freet. https://mongoosejs.com/docs/typescript.html
 */
class TagCollection {
  /**
   * Add a tag to the collection
   *
   * @param {string} source - The id of the item being tagged
   * @param {string} label - The label of the tag
   * @return {Promise<HydratedDocument<Tag>>} - The newly created freet
   */
  static async addOne(source: Types.ObjectId | string, label: string): Promise<HydratedDocument<Tag>> {
    const tag = new TagModel({
      source,
      label
    });
    await tag.save(); // Saves freet to MongoDB
    return tag;
  }

  /**
   * Find a tag by tagId
   *
   * @param {string} tagid - The id of the tag to find
   * @return {Promise<HydratedDocument<Tag>> | Promise<null> } - The tag with the given tagid, if any
   */
  static async findOne(tagId: Types.ObjectId | string): Promise<HydratedDocument<Tag>> {
    return TagModel.findOne({_id: tagId});
  }

  /**
   * Find a tag by source and label
   *
   * @param {string} source - The id of the content being tagged
   * @param {string} label - The label of the tag
   * @return {Promise<HydratedDocument<Tag>> | Promise<null> } - The tag with the given data, if any
   */
  static async findOneByFields(source: Types.ObjectId | string, label: string): Promise<HydratedDocument<Tag>> {
    return TagModel.findOne({source, label});
  }

  /**
   * Get all the tags for a given item
   *
   * @param {string} source - The id of the item being tagged
   * @return {Promise<HydratedDocument<Tag>[]>} - An array of all of the freets
   */
  static async findAllBySource(source: Types.ObjectId | string): Promise<Array<HydratedDocument<Tag>>> {
    return TagModel.find({source});
  }

  /**
   * Delete a tag with given tagId.
   *
   * @param {string} tagId - The tagId of tag to delete
   * @return {Promise<Boolean>} - true if the tag has been deleted, false otherwise
   */
  static async deleteOne(tagId: Types.ObjectId | string): Promise<boolean> {
    const tag = await TagModel.deleteOne({_id: tagId});
    return tag !== null;
  }

  /**
   * Delete all the freets associated with an item
   *
   * @param {string} source - The id of item being tagged
   */
  static async deleteMany(source: Types.ObjectId | string): Promise<void> {
    await TagModel.deleteMany({source});
  }
}

export default TagCollection;
