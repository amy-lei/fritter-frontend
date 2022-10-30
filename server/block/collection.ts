import type {HydratedDocument, Types} from 'mongoose';
import type {Block} from './model';
import BlockModel from './model';

/**
 * This files contains a class that has the functionality to explore blocks
 * stored in MongoDB, including adding, finding, and deleting blocks.
 */
class BlockCollection {
  /**
   * Add a block to the collection
   *
   * @param {string} blocker - The id of the user doing the blocking
   * @param {string} blockee - The id of the user being blocked
   * @return {Promise<HydratedDocument<Block>>} - The newly created block
   */
  static async addOne(blocker: Types.ObjectId | string, blockee: Types.ObjectId | string): Promise<HydratedDocument<Block>> {
    const block = new BlockModel({
      blocker,
      blockee
    });
    await block.save();
    return block.populate(['blocker', 'blockee']);
  }

  /**
   * Find a block by blockId
   *
   * @param {string} blockId - The id of the block to find
   * @return {Promise<HydratedDocument<Block>> | Promise<null> } - The block with the given blockid, if any
   */
  static async findOne(blockId: Types.ObjectId | string): Promise<HydratedDocument<Block>> {
    return BlockModel.findOne({_id: blockId}).populate(['blocker', 'blockee']);
  }

  /**
   * Find a block by blocker/blockee relationship
   *
   * @param {string} blocker - The id of the blocker
   * @param {string} blocker - The id of the user being blocked
   * @return {Promise<HydratedDocument<Block>> | Promise<null> } - The block with the given blockid, if any
   */
  static async findOneByFields(blocker: Types.ObjectId | string, blockee: Types.ObjectId | string): Promise<HydratedDocument<Block>> {
    return BlockModel.findOne({blocker, blockee}).populate(['blocker', 'blockee']);
  }

  /**
   * Get all the blockees for a given blocker
   *
   * @param {string} blocker - The id of the user doing the blocking
   * @return {Promise<HydratedDocument<Block>[]>} - An array of all of the blocks
   */
  static async findAllByBlocker(blocker: Types.ObjectId | string): Promise<Array<HydratedDocument<Block>>> {
    return BlockModel.find({blocker}).populate(['blocker', 'blockee']);
  }

  /**
   * Delete a block with given blockId.
   *
   * @param {string} blockId - The blockId of block to undo
   * @return {Promise<Boolean>} - true if the block has been deleted, false otherwise
   */
  static async deleteOne(blockId: Types.ObjectId | string): Promise<boolean> {
    const block = await BlockModel.deleteOne({_id: blockId});
    return block !== null;
  }
}

export default BlockCollection;
