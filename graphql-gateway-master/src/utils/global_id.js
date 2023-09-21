import {btoa, atob} from './base64';
import {UserInputError} from 'apollo-server-express';
import {logger} from './logger';

const INTERNAL_ID_SEPERATOR = '---';

/**
 * Generate global resource id
 * @param {string} resourceType Type of resource
 * @param {*} lid Local ID of resource
 * @return {String} The global ID
 */
export function internalToGlobalId(resourceType, lid) {
  if (Array.isArray(lid)) {
    if (lid.join('').includes(INTERNAL_ID_SEPERATOR)) {
      throw new Error(`Internal ID contains a reserved sequence!!!`);
    }
  } else {
    if (lid.toString().includes(INTERNAL_ID_SEPERATOR)) {
      throw new Error(`Internal ID contains a reserved sequence!!!`);
    }
  }

  if (Array.isArray(lid)) {
    return btoa(`uri:node:${resourceType}:${lid.join(INTERNAL_ID_SEPERATOR)}`);
  } else {
    return btoa(`uri:node:${resourceType}:${lid}`);
  }
}

/**
 * Convert global resource id into local resource id
 * @param {string} resourceType The expected type of resource in the global ID
 * @param {string} gid Global node id
 * @return {*} Local ID
 */
export function globalToInternalId(resourceType, gid) {
  const uriArr = atob(gid).split(':');

  if (uriArr[1] != 'node' || uriArr[2] != resourceType) {
    throw new UserInputError(`Incorrect GraphQL Node ID: ${atob(gid)}`);
  }

  const idArr = uriArr[3].split(INTERNAL_ID_SEPERATOR);
  return idArr.length == 1 ? idArr[0] : idArr;
}

/**
 * Convert global resource id into local resource id with resource type
 * @param {string} gid Global node id
 * @return {*} Local ID
 */
export function globalToInternalIdWithResourceType(gid) {
  const uriArr = atob(gid).split(':');
  if (uriArr[0] != 'uri') {
    throw new UserInputError(`Incorrect GraphQL Node ID: ${gid}`);
  }

  if (uriArr[1] != 'node') {
    throw new UserInputError(`Incorrect GraphQL Node ID: ${gid}`);
  }

  const idArr = uriArr.slice(3).join(':').split(INTERNAL_ID_SEPERATOR);
  const resourceType = uriArr[2];

  const internalId = idArr.length == 1 ? idArr[0] : idArr;
  return {
    resourceType,
    internalId,
  };
}
