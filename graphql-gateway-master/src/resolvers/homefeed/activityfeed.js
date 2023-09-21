import moment from 'moment';
import {logger} from '../../utils/logger';


const PHOTO_OBJECT_TYPE = 1;
const USER_OBJECT_TYPE = 7;
const COMMENT_OBJECT_TYPE = 8;
const GALLERY_OBJECT_TYPE = 14;
const QUEST_OBJECT_TYPE = 16;
const WORKSHOP_OBJECT_TYPE = 17;

const FOLLOW_ACTION = 1;
const LIKE_ACTION = 2;
const PUBLISH_ACTION = 3;
const COMMENT_ACTION = 4;
const ADD_ACTION = 5;
const ACTIVITY_GROUP_LIMIT = 15;

export const ACTION_MAPPING = {
  1: 'FOLLOW_ACTION',
  2: 'LIKE_ACTION',
  3: 'PUBLISH_ACTION',
  4: 'COMMENT_ACTION',
  5: 'ADD_ACTION',
};
// export const ACTION_REVERSE_MAPPING = reverseLookupTable(ACTION_MAPPING);

export const OBJECT_TYPE_MAPPING = {
  0: 'UNKNOWN_OBJECT_TYPE',
  1: 'PHOTO_OBJECT_TYPE',
  7: 'USER_OBJECT_TYPE',
  8: 'COMMENT_OBJECT_TYPE',
  14: 'GALLERY_OBJECT_TYPE',
  16: 'QUEST_OBJECT_TYPE',
  17: 'WORKSHOP_OBJECT_TYPE',
};
// export const OBJECT_TYPE_REVERSE_MAPPING = reverseLookupTable(OBJECT_TYPE_MAPPING);


export const TARGET_TYPE_MAPPING = {
  0: 'UNKNOWN_OBJECT_TYPE',
  1: 'PHOTO_OBJECT_TYPE',
  7: 'USER_OBJECT_TYPE',
  8: 'COMMENT_OBJECT_TYPE',
  14: 'GALLERY_OBJECT_TYPE',
  16: 'QUEST_OBJECT_TYPE',
  17: 'WORKSHOP_OBJECT_TYPE',
};
// export const TARGET_TYPE_REVERSE_MAPPING = reverseLookupTable(TARGET_TYPE_MAPPING);

export const PX_USERID = 10599609;

export const resolvers = {
  Query: {
    activityfeeds: async (_, {first, after, excludeNude}, {dataSources}) => {
      /*
       *  Accept either page numbers or next_page cursor
       * logger.debug(`first=====`, {first: first});
       */
      first = !!first ? first : 20;
      let requestTries = 0;

      const {
        __userIds,
      } = await dataSources.Following.activityFollowings.userList();

      // const __userIds =[1000192307];

      // logger.debug(`__userIds`, {__userIds: __userIds});

      const currentUserId = dataSources.UserCenter.user.currentUserId;

      const groups= [];
      do {
        /*
         * logger.debug(`requestTries`, {requestTries: requestTries});
         * logger.debug(`groupsLength`, {groupsLength: groups.length});
         */


        const {
          hydratedActivities,
          nextPage,
        } = await hydratedActivitiesLoop(first, after, excludeNude, __userIds, currentUserId, dataSources);
        after = nextPage;
        /*
         *  filter out activities on the same photo by the same user
         * logger.debug(`hydratedActivities==`, {hydratedActivities: hydratedActivities});
         * logger.debug(`hydratedActivitiesLength`, {hydratedActivitiesL: hydratedActivities.length});
         */

        const filteredActivities = filterActivities(hydratedActivities);

        // group activities by user and action
        groupActivities(groups, filteredActivities);

        requestTries += 1;

        // logger.debug(`requestTries ==1`, {isRequestTries: groups.length < 2 && requestTries < 2 && !!after});
      } while (groups.length < 2 && requestTries < 2 && !!after);

      return {
        edges: groups.map((group) => {
          return {
            node: group,
            // cursor: btoa(node.eventId+'::'+currentUserId).replace(/\+/g, '-').replace(/\//g, '_'),
          };
        }),
        pageInfo: {
          // startCursor: nextPage,
          endCursor: after,
          hasNextPage: !!after,
        },
        totalCount: groups.length,
      };
    },
  },
};

/**
 * hydratedActivitiesLoop.
 * @param {*} first
 * @param {*} nextPage
 * @param {*} excludeNude
 * @param {*} userIds
 * @param {*} currentUserId
 * @param {*} dataSources
 * @return {Promise<Array>} A promise which will return an array of response from API corresponding
 */
async function hydratedActivitiesLoop(first, nextPage, excludeNude, userIds, currentUserId, dataSources) {
  const hydratedActivities = [];
  let requestTries = 0;
  if (userIds.length > 0) {
    const followedUserIds = userIds.map(String);


    /*
     * Attempt to return a full page of activities.
     * Max out at some point to avoid looping for a long while.  However, we'll still return
     * the next page's cursor, so the caller can make another request to continue searching
     * if desired
     */
    do {
      const {
        __activities,
        next,
      } = await dataSources.Homefeed.activityfeed.activityfeedPaginated(
          first, nextPage, followedUserIds,
      );

      const photoIds = [];
      const userIds = [];
      const commentIds = [];
      const galleryIds = [];
      const questIds = [];
      const workshopIds = [];

      for (let j = 0, len = __activities.length; j < len; j++) {
        if (__activities[j].objectType == PHOTO_OBJECT_TYPE) {
          photoIds.push(__activities[j].objectItemId);
        } else if (__activities[j].objectType == USER_OBJECT_TYPE) {
          userIds.push(__activities[j].objectItemId);
        } else if (__activities[j].objectType == COMMENT_OBJECT_TYPE) {
          commentIds.push(__activities[j].objectItemId);
        } else if (__activities[j].objectType == GALLERY_OBJECT_TYPE) {
          galleryIds.push(__activities[j].objectItemId);
        } else if (__activities[j].objectType == QUEST_OBJECT_TYPE) {
          questIds.push(__activities[j].objectItemId);
        } else if (__activities[j].objectType == WORKSHOP_OBJECT_TYPE) {
          workshopIds.push(__activities[j].objectItemId);
        }

        if (__activities[j].targetType == PHOTO_OBJECT_TYPE) {
          if (__activities[j].targetItemId != 0) {
            photoIds.push(__activities[j].targetItemId);
          }
        } else if (__activities[j].targetType == USER_OBJECT_TYPE) {
          if (__activities[j].targetItemId != 0) {
            userIds.push(__activities[j].targetItemId);
          }
        } else if (__activities[j].targetType == COMMENT_OBJECT_TYPE) {
          if (__activities[j].targetItemId != 0) {
            commentIds.push(__activities[j].targetItemId);
          }
        } else if (__activities[j].targetType == GALLERY_OBJECT_TYPE) {
          if (__activities[j].targetItemId != 0) {
            galleryIds.push(__activities[j].targetItemId);
          }
        } else if (__activities[j].targetType == QUEST_OBJECT_TYPE) {
          if (__activities[j].targetItemId != 0) {
            questIds.push(__activities[j].targetItemId);
          }
        } else if (__activities[j].targetType == WORKSHOP_OBJECT_TYPE) {
          if (__activities[j].targetItemId != 0) {
            workshopIds.push(__activities[j].targetItemId);
          }
        }

        // old comment actor is wrong
        if (!!__activities[j].userId && __activities[j].action != COMMENT_ACTION) {
          userIds.push(__activities[j].userId);
        }
      }

      const [comments, lookupGalleryById, lookupQuestById, lookupQuestGeoById, workshops] = await Promise.all([
        promiseComment(dataSources, commentIds),
        promiseGallery(dataSources, galleryIds),
        promiseQuest(dataSources, questIds),
        promiseQuestGeo(dataSources, questIds),
        promiseWorkshop(dataSources, workshopIds),
      ]);

      const lookupCommentById = comments.reduce(function(map, obj) {
        if (null != obj) {
          map[obj.id] = dataSources.Commenting.comment.reducer(obj);
          // add comment actor
          userIds.push(map[obj.id].__creatorUserId);
        }
        return map;
      }, {});

      const workshopUserIds = [];
      const lookupWorkshopById = workshops.reduce(function(map, obj) {
        // logger.debug(`workshops====obj`, {workshops: obj});
        if (null != obj) {
          if (obj.userId) {
            workshopUserIds.push(obj.userId);
          }
          map[obj.legacyId] = obj;
          if (obj.__coverPhotoId) {
            photoIds.push(obj.__coverPhotoId);
          }
        }
        return map;
      }, {});

      const [lookupUserById, lookupMembershipsById, lookupPhotoById] = await Promise.all([
        promiseUser(dataSources, userIds),
        promiseMemberships(dataSources, workshopUserIds),
        promisePhoto(dataSources, photoIds),
      ]);

      /*
       * logger.debug(`lookupUserById====`, {lookupUserById: lookupUserById});
       * logger.debug(`lookupPhotoById====`, {lookupPhotoById: lookupPhotoById});
       * logger.debug(`lookupGalleryById====`, {lookupGalleryById: lookupGalleryById});
       */
      /*
       * logger.debug(`lookupWorkshopById====`, {lookupWorkshopById: lookupWorkshopById});
       * logger.debug(`lookupMembershipsById====`, {lookupMembershipsById: lookupMembershipsById});
       */

      /*
       * logger.debug(`lookupUserById`, {lookupUserById: lookupUserById});
       * # add hydrated objects into results
       */

      // logger.debug(`lookupQuestGeoById====11`, {lookupQuestGeoById: lookupQuestGeoById});
      __activities.forEach((activity) => {
        let objectComment = null;
        if (activity.action == COMMENT_ACTION) {
          objectComment = lookupCommentById[activity.objectItemId];
          if (!!objectComment) {
            activity.userId = objectComment.__creatorUserId;
          }
        }
        const activityUser = lookupUserById[activity.userId];
        if (!!activityUser && activityUser.active == 1) {
          activity.user = lookupUserById[activity.userId];
          // logger.debug(`objectItemId====`, {objectItemId_exist: !!activity.objectItemId});

          if (!!activity.objectItemId) {
            if (activity.objectType == PHOTO_OBJECT_TYPE) {
              activity.object = lookupPhotoById[activity.objectItemId];
              // exclude nude photo
              if (!!activity.object && activity.object.notSafeForWork && excludeNude) {
                delete activity.object;
              }
              if (!!activity.object && activity.object.__uploaderUserId == currentUserId) {
                delete activity.object;
              }
            } else if (activity.objectType == USER_OBJECT_TYPE) {
              const objectUser = lookupUserById[activity.objectItemId];
              if (!!objectUser && objectUser.active == 1) {
                // filter follow current user
                if (!(activity.action == FOLLOW_ACTION && activity.objectItemId == currentUserId)) {
                  // filter follow 500px
                  if (!(activity.action == FOLLOW_ACTION && activity.objectItemId == PX_USERID )) {
                    activity.object = objectUser;
                  }
                }
              }
            } else if (activity.objectType == COMMENT_OBJECT_TYPE) {
              objectComment = lookupCommentById[activity.objectItemId];
              // filter comment current user's photo
              activity.object = objectComment;
              // logger.debug(`comment activity====`, {activity: activity});
              if (activity.action == COMMENT_ACTION && (!objectComment || objectComment.__photoUserId == currentUserId || objectComment.__photoUserId == objectComment.__creatorUserId)) {
                delete activity.object;
              }
            } else if (activity.objectType == GALLERY_OBJECT_TYPE) {
              activity.object = lookupGalleryById[activity.objectItemId];
            } else if (activity.objectType == QUEST_OBJECT_TYPE) {
              const objectQuest = lookupQuestById[activity.objectItemId];
              const objectQuestGeo = lookupQuestGeoById[activity.objectItemId];
              // logger.debug(`objectQuestGeo====11`, {objectQuestGeo: objectQuestGeo});
              if (objectQuestGeo && objectQuestGeo.length ==0) {
                activity.object = objectQuest;
              }
            } else if (activity.objectType == WORKSHOP_OBJECT_TYPE) {
              const workshop = lookupWorkshopById[activity.objectItemId];
              if (workshop !== undefined) {
                // logger.debug(`workshop====`, {workshop: workshop});
                const membership = lookupMembershipsById[workshop.__creatorUserId];
                // logger.debug(`membership====`, {membership: membership});
                workshop.disabled = (!!membership && membership.tier != 'Pro') ? true : false;

                // logger.debug(`workshop====11`, {workshop: workshop});
                if (!workshop.disabled && workshop.state === 'ACTIVE') {
                  activity.object = workshop;
                  if (!!workshop.__coverPhotoId) {
                    const photo = lookupPhotoById[workshop.__coverPhotoId];
                    if (!!photo && photo.notSafeForWork && excludeNude) {
                      delete activity.object;
                    }
                  }
                }
              }
            }
          }

          // logger.debug(`activity====`, {activity: activity});

          // logger.debug(`targetItemId====`, {targetItemId_exist: !!activity.targetItemId});
          if (!!activity.targetItemId && activity.targetItemId != 0) {
            if (activity.targetType == PHOTO_OBJECT_TYPE) {
              activity.target = lookupPhotoById[activity.targetItemId];
              // exclude ude photo
              if (!!activity.target && activity.target.notSafeForWork && excludeNude) {
                delete activity.target;
              }
            } else if (activity.targetType == USER_OBJECT_TYPE) {
              const targetUser = lookupUserById[activity.targetItemId];
              if (!!targetUser && targetUser.active == 1) {
                activity.target = targetUser;
              }
            } else if (activity.targetType == COMMENT_OBJECT_TYPE) {
              activity.target = lookupCommentById[activity.targetItemId];
            } else if (activity.targetType == GALLERY_OBJECT_TYPE) {
              activity.target = lookupGalleryById[activity.targetItemId];
            } else if (activity.targetType == QUEST_OBJECT_TYPE) {
              const targetQuest = lookupQuestById[activity.targetItemId];
              const targetQuestGeo = lookupQuestGeoById[activity.targetItemId];
              // logger.debug(`targetQuestGeo====11`, {targetQuestGeo: targetQuestGeo});
              if (targetQuestGeo && targetQuestGeo.length ==0) {
                if (!!activity.object && activity.object.__uploaderUserId != currentUserId) {
                  activity.target = targetQuest;
                }
              }
            } else if (activity.targetType == WORKSHOP_OBJECT_TYPE) {
              const workshop = lookupWorkshopById[activity.targetItemId];
              // logger.debug(`workshop====`, {workshop: workshop});
              const membership = lookupMembershipsById[workshop.__creatorUserId];
              // logger.debug(`membership====`, {membership: membership});
              workshop.disabled = (!!membership && membership.tier != 'Pro') ? true : false;
              if (!workshop.disabled && workshop.state ==1) {
                activity.target = workshop;
                if (!!workshop.__coverPhotoId) {
                  const photo = lookupPhotoById[workshop.__coverPhotoId];
                  if (!!photo && photo.notSafeForWork && excludeNude) {
                    delete activity.target;
                  }
                }
              }
            }
          }
          if (!!activity.object) {
            if (activity.targetType == COMMENT_OBJECT_TYPE || activity.targetType == GALLERY_OBJECT_TYPE ||activity.targetType == QUEST_OBJECT_TYPE) {
              if (!!activity.target) {
                hydratedActivities.push(activity);
              }
            } else {
              hydratedActivities.push(activity);
            }
          }
        }
      }),

      // Otherwise need to make another request, none of these photos was displayable
      requestTries += 1;
      nextPage = next == '0A'? '': next;
      // logger.debug(`nextPage`, {nextPage: nextPage});
    } while (hydratedActivities.length < first && requestTries < 10 && !!nextPage);
    return {
      hydratedActivities,
      nextPage,
    };
  } else {
    return {
      hydratedActivities,
      nextPage: '',
    };
  }
}

/**
 * promiseComment.
 * @param {*} dataSources
 * @param {*} commentIds
 * @return {Promise<Object>} A promise which will return an object of response from API corresponding
 */
async function promiseComment(dataSources, commentIds) {
  // # get comment models from API
  let comments = [];
  if (commentIds.length > 0) {
    comments = await dataSources.Commenting.comment.bulkLoadData(commentIds);
  }
  return comments;
}


/**
 * promiseGallery.
 * @param {*} dataSources
 * @param {*} galleryIds
 * @return {Promise<Object>} A promise which will return an object of response from API corresponding
 */
async function promiseGallery(dataSources, galleryIds) {
  // # get gallery models from API
  let lookupGalleryById = {};
  if (galleryIds.length > 0) {
    const galleries = await dataSources.Gallery.gallery.bulkLoadData(galleryIds);
    lookupGalleryById = galleries.reduce(function(map, obj) {
      if (null != obj) {
        map[obj.id] = dataSources.Gallery.gallery.reducer(obj);
      }
      return map;
    }, {});
  }
  return lookupGalleryById;
}

/**
 * promiseQuest.
 * @param {*} dataSources
 * @param {*} questIds
 * @return {Promise<Object>} A promise which will return an object of response from API corresponding
 */
async function promiseQuest(dataSources, questIds) {
  // get quest models from API
  let lookupQuestById = {};
  if (questIds.length > 0) {
    const quests = await dataSources.Quest.quest.bulkLoadData(questIds);
    lookupQuestById = quests.reduce(function(map, obj) {
      if (null != obj) {
        map[obj.id] = dataSources.Quest.quest.reducer(obj);
      }
      return map;
    }, {});
  }
  return lookupQuestById;
}

/**
 * promiseQuestGeo.
 * @param {*} dataSources
 * @param {*} questIds）
 * @return {Promise<Object>} A promise which will return an object of response from API corresponding
 */
async function promiseQuestGeo(dataSources, questIds) {
  // get quest models from API
  let lookupQuestGeoById = {};
  if (questIds.length > 0) {
    const questGeos = await dataSources.Quest.questGeofences.bulkLoadData(questIds);
    // logger.debug(`questGeos====11`, {questGeos: questGeos});
    lookupQuestGeoById = questGeos.reduce(function(map, obj, index) {
      map[questIds[index]] = obj;
      return map;
    }, {});
  }
  return lookupQuestGeoById;
}

/**
 * promiseMemberships.
 * @param {*} dataSources
 * @param {*} workshopIds
 * @return {Promise<Object>} A promise which will return an object of response from API corresponding
 */
async function promiseWorkshop(dataSources, workshopIds) {
  // get Workshop models from API
  let workshops= [];
  if (workshopIds.length > 0) {
    workshops = await dataSources.Resource.resource.findByInternalIds(workshopIds);
  }
  return workshops;
}


/**
 * promiseMemberships.
 * @param {*} dataSources
 * @param {*} userIds
 * @return {Promise<Object>} A promise which will return an object of response from API corresponding
 */
async function promiseMemberships(dataSources, userIds) {
  // get membership models from API
  let lookupMembershipsById = {};
  if (!!userIds && userIds.length > 0) {
    const memberships = await dataSources.Membership.membership.bulkLoadData(userIds);
    lookupMembershipsById = memberships.reduce(function(map, obj) {
      map[obj.user_id] = obj;
      return map;
    }, {});
  }
  return lookupMembershipsById;
}

/**
 * promiseUser.
 * @param {*} dataSources
 * @param {*} userIds
 * @return {Promise<Object>} A promise which will return an object of response from API corresponding
 */
async function promiseUser(dataSources, userIds) {
  // # get user models from API
  let lookupUserById = {};
  if (userIds.length > 0) {
    const users = await dataSources.UserCenter.user.bulkLoadData(userIds);
    lookupUserById = users.reduce(function(map, obj) {
      if (null != obj) {
        map[obj.id] = dataSources.UserCenter.user.reducer(obj);
      }
      return map;
    }, {});
  }
  return lookupUserById;
}

/**
 * promisePhoto.
 * @param {*} dataSources
 * @param {*} photoIds
 * @return {Promise<Object>} A promise which will return an object of response from API corresponding
 */
async function promisePhoto(dataSources, photoIds) {
  // get photo models from API
  let lookupPhotoById = {};
  if (photoIds.length > 0) {
    const photos = await dataSources.Photo.photo.bulkLoadData(photoIds);
    lookupPhotoById = photos.reduce(function(map, obj) {
      if (null != obj) {
        map[obj.id] = dataSources.Photo.photo.reducer(obj);
      }
      return map;
    }, {});
  }
  return lookupPhotoById;
}


/**
 * photoActivityPriority.
 * @param {*} activity
 * @return {Promise<Array>} A promise which will return an array of response from API corresponding
 */
function photoActivityPriority(activity) {
  // priority of photo actions, where higher priority actions should be shown instead of lower
  if (activity.action == COMMENT_ACTION && activity.targetType == PHOTO_OBJECT_TYPE) {
    // comment
    return 3;
  } else if (activity.action == ADD_ACTION && activity.targetType == GALLERY_OBJECT_TYPE) {
    // add to gallery
    return 2;
  } else if ( activity.action == LIKE_ACTION) {
    // like
    return 1;
  }
  // no priority
  return -1;
}

/**
 * filterActivities
 * @param {*} activities
 * @return {Promise<Array>} A promise which will return an array of response from API corresponding
 */
function filterActivities(activities) {
  const filteredActivities = [];
  // filter out activities on the same photo by the same user
  const activityLookup = {};
  activities.forEach((activity) => {
    if (activity.objectType == PHOTO_OBJECT_TYPE || (activity.action == COMMENT_ACTION && activity.targetType == PHOTO_OBJECT_TYPE)) {
      if (activity.targetType != QUEST_OBJECT_TYPE) {
        // filteredActivities.push(activity);
        let photoId = activity.objectItemId;
        if (activity.action == COMMENT_ACTION) {
          photoId = activity.targetItemId;
        }
        const key = activity.userId + ':' + photoId;
        const existing = activityLookup[key];
        // replace the stored activity with the new one if it has a higher priority
        if (existing == null || photoActivityPriority(activity) > photoActivityPriority(existing)) {
          activityLookup[key] = activity;
        }
      }
    }
  });

  /*
   * for (const itemKey in activityLookup) {
   *   if (activityLookup.hasOwnProperty(itemKey)) {
   *     filteredActivities.push(activityLookup[itemKey]);
   *   }
   * }
   */

  activities.forEach((activity) => {
    if ((activity.objectType == PHOTO_OBJECT_TYPE || (activity.action == COMMENT_ACTION && activity.targetType == PHOTO_OBJECT_TYPE)) && activity.targetType != QUEST_OBJECT_TYPE) {
      let photoId = activity.objectItemId;
      if (activity.action == COMMENT_ACTION) {
        photoId = activity.targetItemId;
      }
      const key = activity.userId + ':' + photoId;
      if (activity == activityLookup[key]) {
        filteredActivities.push(activity);
      }
    } else {
      filteredActivities.push(activity);
    }
  });

  return filteredActivities;
}

/**
 * groupActivities.
 * @param {*} activityGroups
 * @param {*} activities
 * @return {Promise<Array>} A promise which will return an array of response from API corresponding
 */
function groupActivities(activityGroups, activities) {
  const groupLookup = {};

  const photoSubmissionTargets = [GALLERY_OBJECT_TYPE, QUEST_OBJECT_TYPE];
  // filter out activities on the same photo by the same user
  activities.forEach((activity) => {
    let key = activity.userId + ':' + activity.action + ':' + activity.objectType+':'+activity.targetType;
    if ((activity.action == ADD_ACTION || activity.action == LIKE_ACTION) && activity.objectType == PHOTO_OBJECT_TYPE && photoSubmissionTargets.indexOf(activity.targetType) > -1) {
      //  # add to gallery activities must be grouped by gallery 、add to quest、  add to quest shortlist  must be grouped by quest
      key = activity.userId + ':' + activity.action + ':' + activity.objectType + ':' + activity.targetType + ':' + activity.targetItemId;
    } else if ((activity.action == ADD_ACTION || activity.action == PUBLISH_ACTION) && activity.objectType == WORKSHOP_OBJECT_TYPE ) {
      key = activity.userId + ':' + activity.action + ':' + activity.objectType +':' + activity.targetType + ':' + activity.objectItemId;
      // logger.debug(`WORKSHOP_OBJECT_TYPE====key`, {key: key});
    } else if (activity.action == COMMENT_ACTION && activity.targetType == PHOTO_OBJECT_TYPE ) {
      key = activity.userId + ':' + activity.action + ':' + activity.objectType +':' + activity.targetType + ':' + activity.objectItemId;
      // logger.debug(`WORKSHOP_OBJECT_TYPE====key`, {key: key});
    }
    activity.action = ACTION_MAPPING[activity.action];
    activity.objectType = OBJECT_TYPE_MAPPING[activity.objectType];
    activity.targetType = TARGET_TYPE_MAPPING[activity.targetType];
    activity.published = moment.unix(activity.published).format('YYYY-MM-DDTHH:mm:ss.SSSZZ');
    // # check if group already exists
    let group = groupLookup[key];
    // # if the group doesn't exist, or is full, create a new one
    if (group == null || group.activities.length >= ACTIVITY_GROUP_LIMIT) {
      group = {
        action: activity.action,
        user: activity.user,
        userId: activity.userId,
        objectType: activity.objectType,
        targetType: activity.targetType,
        activities: [],
      };
      /*
       * store group in lookup hash and ordered activity_groups list
       * note: if this group was created because a previous group of the same key was full, then the new
       * group replaces the old one in the lookup and all new activities are added to it. Previous
       * groups are not lost, though, as they remain in the ordered activity_groups list
       */
      groupLookup[key] = group;
      activityGroups.push(group);
    }
    group.activities.push(activity);
  });

  return activityGroups;
}
