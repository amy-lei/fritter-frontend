import type {HydratedDocument, Types} from 'mongoose';
import type {Reaction, ReactionType} from './model';
import ReactionModel from './model';

/**
 * This files contains a class that has the functionality to explore reactions
 * stored in MongoDB, including adding, finding, updating, and deleting reactions.
 */
class ReactionCollection {
  /**
   * Add a reaction to the collection
   *
   * @param {string} issuerId - The id of the author reacting
   * @param {string} source - The id of the item being reacted to
   * @param {string} type - The type enum describing the react
   * @return {Promise<HydratedDocument<Reaction>>} - The newly created freet
   */
  static async addOne(issuerId: Types.ObjectId | string, source: Types.ObjectId | string, type: ReactionType): Promise<HydratedDocument<Reaction>> {
    const reaction = new ReactionModel({
      issuerId,
      source,
      type,
    });
    await reaction.save(); // Saves freet to MongoDB
    return reaction;
  }

  /**
   * Get all the reactions in the database
   *
   * @return {Promise<HydratedDocument<Reaction>[]>} - An array of all of the reactions
   */
  static async findAll(): Promise<Array<HydratedDocument<Reaction>>> {
    return ReactionModel.find({})
      .sort({source: -1, issuerId: -1})
      .populate('issuerId');
  }

  /**
   * Get all the reactions in a given freet
   *
   * @param {string} freetId  - The ID of the freet
   * @return {Promise<HydratedDocument<Reaction>[]>} - An array of all of the reactions
   */
  static async findAllByFreetId(freetId: Types.ObjectId | string): Promise<Array<HydratedDocument<Reaction>>> {
    return ReactionModel.find({source: freetId}).populate('source');
  }

  /**
   * Find a reaction by id
   *
   * @param {string} reactionId  - The ID of reaction
   * @return {Promise<HydratedDocument<Reaction>[]>} - An array of all of the reactions
   */
  static async findOne(reactionId: Types.ObjectId | string): Promise<HydratedDocument<Reaction>> {
    return ReactionModel.findOne({_id: reactionId});
  }

  /**
   * Find a reaction by a user for a given freet
   *
   * @param {string} source  - The ID of the content reacted to
   * @param {string} issuerId  - The ID of the user issuing the react
   * @return {Promise<HydratedDocument<Reaction>[]>} - An array of all of the reactions
   */
  static async findOneWithSourceAndIsssuer(source: Types.ObjectId | string, issuerId: Types.ObjectId | string): Promise<HydratedDocument<Reaction>> {
    return ReactionModel.findOne({source, issuerId});
  }

  /**
   * Update a reaction with the new type
   *
   * @param {string} reactionId - The id of the reaction to be updated
   * @param {string} type - The new type of the reaction
   * @return {Promise<HydratedDocument<Reaction>>} - The newly updated reaction
   */
  static async updateOne(reactionId: Types.ObjectId | string, type: ReactionType): Promise<HydratedDocument<Reaction>> {
    const reaction = await ReactionModel.findOne({_id: reactionId});
    reaction.type = type;
    await reaction.save();
    return reaction.populate('source');
  }

  /**
   * Delete a reaction with given reactionId.
   *
   * @param {string} reactionId - The reactionId of reaction to delete
   * @return {Promise<Boolean>} - true if the reaction has been deleted, false otherwise
   */
  static async deleteOne(reactionId: Types.ObjectId | string): Promise<boolean> {
    const reaction = await ReactionModel.deleteOne({_id: reactionId});
    return reaction !== null;
  }

  /**
   * Delete all the reactions in a given freet
   *
   * @param {string} freetId - The id freets to delete reactions from
   */
  static async deleteMany(freetId: Types.ObjectId | string): Promise<void> {
    await ReactionModel.deleteMany({source: freetId});
  }
}

export default ReactionCollection;
