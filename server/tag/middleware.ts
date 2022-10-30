import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import FreetCollection from '../freet/collection';
import UserCollection from '../user/collection';
import TagCollection from './collection';

const isValidSource = (req: Request, res: Response, next: NextFunction) => {
  const source = req.method === 'POST'
    ? req.body.source
    : req.method === 'GET'
      ? req.query.source
      : req.params.source;
  const validFormat = Types.ObjectId.isValid(source);
  if (!validFormat) {
    res.status(400).json({
      error: `'${source}' is an invalidly formatted source ID`
    });
    return;
  }
  next();
}


/**
 * Checks if the user logged in is allowed to modify the tag. If the source
 * corresponds to a User, then the users must be the same. If the source
 * corresponds to a Freet, the the user must be the author of the freet.
 */
const isValidModifier = async (req: Request, res: Response, next: NextFunction) => {
  let source = '';
  if (req.method === 'POST') {
    source = req.body.source;
  } else {
    const tag = await TagCollection.findOne(req.params.tagId);
    source = tag.source.toString();
  }

  const validFormat = Types.ObjectId.isValid(source);
  const user = validFormat ? await UserCollection.findOneByUserId(source) : undefined;
  if (user) {
    const userId = req.session.userId as string;
    if (source !== userId) {
      res.status(403).json({
        error: 'Cannot modify tags on other users'
      });
      return;
    }
    next();
    return;
  }
  const freet = validFormat ? await FreetCollection.findOne(source) : undefined;
  if (freet) {
    const authorId = freet.authorId._id;
    if (authorId.toString() !== req.session.userId) {
      res.status(403).json({
        error: 'Cannot modify tags on other users\' freets'
      });
      return;
    }
    next();
    return;
  }
  res.status(404).json({
    error: `Source with id '${source}' could not be found`
  });
} 


/**
 * Checks if there is an existing tag for this source/label combo
 */
const isNotDuplicate = async (req: Request, res: Response, next: NextFunction) => {
  const source = req.body.source;
  const label = req.body.label;
  const tag = await TagCollection.findOneByFields(source, label);
  if (tag) {
    res.status(400).json({
      error: `Tag for ${source} with label ${label} already exists`
    });
    return;
  }
  next();
}


/**
 * Checks if there is a corresponding tag for the tagId
 */
const isTagExist = async (req: Request, res: Response, next: NextFunction) => {
  const tagId = req.params.tagId;
  const validFormat = Types.ObjectId.isValid(tagId);
  const tag = validFormat ? await TagCollection.findOne(tagId) : undefined;
  if (!tag) {
    res.status(404).json({
      error: `Tag with ID '${tagId}' was not found`
    });
    return;
  }
  next();
}

/**
 * Checks if the content of the label in req.body is valid, i.e not a stream of empty
 * spaces, not more than 25 characters, and all alphanumeric
 */
const isValidLabel = (req: Request, res: Response, next: NextFunction) => {
  const {label} = req.body as {label: string};
  if (!label.trim()) {
    res.status(400).json({
      error: 'Tag label must be at least one character long.'
    });
    return;
  }

  if (label.length > 25) {
    res.status(413).json({
      error: 'Tag label must be no more than 25 characters.'
    });
    return;
  }

  if (/[^a-zA-Z0-9]/.test(label) ) {
    res.status(400).json({
      error: 'Tag label must use alphanumeric characters.'
    });
    return;
  }

  next();
};


export {
  isValidModifier,
  isValidSource,
  isValidLabel,
  isTagExist,
  isNotDuplicate,
};
