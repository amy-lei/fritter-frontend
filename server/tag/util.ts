import type {HydratedDocument} from 'mongoose';
import type {Tag} from './model';

// Update this if you add a property to the Freet type!
type TagResponse = {
  _id: string;
  source: string;
  label: string;
};

/**
 * Transform a raw Freet object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Tag>} tag - A tag
 * @returns {FreetResponse} - The freet object formatted for the frontend
 */
const constructTagResponse = (tag: HydratedDocument<Tag>): TagResponse => {
  const tagCopy: Tag = {
    ...tag.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  return {
    _id: tagCopy._id.toString(),
    source: tagCopy.source.toString(),
    label: tagCopy.label,
  };
};

export {
  constructTagResponse
};
