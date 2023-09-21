import {DATA_TYPE, GROUPED_TYPE, NOTIFICATION_ACTION} from '../../data_sources/notification/notification';
import {resolvers as userResolver} from '../user_center/user';
import {resolvers as photoResolver} from '../photo/photo';
import {resolvers as galleryResolver} from '../gallery/gallery';
import {resolvers as questResolver} from '../quest/quest';

const getNodeFromArray = (id, array) => (array || []).find((o) => o && o.legacyId === id);
const getFirstNodeFromArray = (key, actionObjects, nodes) => {
  const value = (actionObjects || []).find((o) => o && o.type === key);
  return value && getNodeFromArray(parseInt(value.id), nodes);
};
const getListNodesFromArray = (key, actionObjects, nodes) => {
  const values = (actionObjects || []).filter((o) => o && o.type === key).map((v) => parseInt(v.id));
  return (nodes || []).filter((o) => o && values.includes(o.legacyId));
};

// hydrateExtra START
export const hydrateExtra = async (notification, allNodes) => {
  const {photos, users} = allNodes;
  const {action, grouped, subNotificationInfo, __raw} = notification;
  const groupedType = subNotificationInfo && subNotificationInfo.groupedType;
  const {actors, actees} = __raw;

  switch (action) {
    case NOTIFICATION_ACTION.FOLLOW_USER: {
      // follow button
      const extras = [];
      if (!grouped) {
        const user = getFirstNodeFromArray(DATA_TYPE.USER, actors, users);
        if (user) {
          extras.push({
            ...user,
            __resolveType: 'FollowInteraction',
          });
        }
      }
      return extras;
    }
    case NOTIFICATION_ACTION.PHOTO_LIKE: {
      const extras = [];
      // photo image
      if (!grouped || groupedType !== GROUPED_TYPE.PHOTO_LIKE_PHOTOS) {
        const photo = getFirstNodeFromArray(DATA_TYPE.PHOTO, actees, photos);
        if (photo) {
          extras.push({
            __resolveType: 'Photo',
            ...photo,
          });
        }
      }
      return extras;
    }
    case NOTIFICATION_ACTION.PHOTO_ADDED_TO_GALLERY: {
      const extras = [];
      // photo image
      if (!grouped) {
        const photo = getFirstNodeFromArray(DATA_TYPE.PHOTO, actees, photos);
        if (photo) {
          extras.push({
            __resolveType: 'Photo',
            ...photo,
          });
        }
      }
      return extras;
    }
    case NOTIFICATION_ACTION.PHOTO_COMMENT:
    case NOTIFICATION_ACTION.PHOTO_COMMENT_MENTION:
    case NOTIFICATION_ACTION.PHOTO_SELECTED_FOR_SHORTLIST:
    case NOTIFICATION_ACTION.QUEST_WINNERS_SELECTED: {
      // photo image
      const extras = [];
      const photo = getFirstNodeFromArray(DATA_TYPE.PHOTO, actees, photos);
      if (photo) {
        extras.push({
          __resolveType: 'Photo',
          ...photo,
        });
      }
      return extras;
    }
    case NOTIFICATION_ACTION.REACHED_POPULAR:
    case NOTIFICATION_ACTION.REACHED_UPCOMING:
    case NOTIFICATION_ACTION.SELECTED_BY_EDITOR:
    case NOTIFICATION_ACTION.LICENSING_UNDER_REVIEW:
    case NOTIFICATION_ACTION.LICENSING_CHANGE_REQUIRED:
    case NOTIFICATION_ACTION.PHOTO_ACCEPTED_TO_LICENSING:
    case NOTIFICATION_ACTION.LICENSING_DECLINED:
    case NOTIFICATION_ACTION.LICENSING_RELEASE_REQUIRED:
    case NOTIFICATION_ACTION.LICENSING_MODEL_RELEASE_SIGNED:
    case NOTIFICATION_ACTION.LICENSING_MODEL_RELEASE_REJECTED:
    case NOTIFICATION_ACTION.LICENSING_SUGGEST: {
      // photo image
      const extras = [];
      if (!grouped || groupedType !== GROUPED_TYPE.LICENSING_SUGGEST_PHOTOS) {
        const photo = getFirstNodeFromArray(DATA_TYPE.PHOTO, actors, photos);
        if (photo) {
          extras.push({
            __resolveType: 'Photo',
            ...photo,
          });
        }
      }
      return extras;
    }
    case NOTIFICATION_ACTION.LICENSING_CR_TWO_WEEKS:
    case NOTIFICATION_ACTION.LICENSING_CR_THREE_MONTHS:
    case NOTIFICATION_ACTION.LICENSING_CR_SIX_MONTHS: {
      const extras = [];
      if (!grouped || groupedType !== GROUPED_TYPE.LICENSING_CR_PHOTOS) {
        const photo = getFirstNodeFromArray(DATA_TYPE.PHOTO, actors, photos);
        if (photo) {
          extras.push({
            __resolveType: 'Photo',
            ...photo,
          });
        }
      }
      return extras;
    }
    case NOTIFICATION_ACTION.LICENSING_CR_REMAIN_TWO_WEEKS: {
      const extras = [];
      if (!grouped || groupedType !== GROUPED_TYPE.LICENSING_CR_REMAIN_PHOTOS) {
        const photo = getFirstNodeFromArray(DATA_TYPE.PHOTO, actors, photos);
        if (photo) {
          extras.push({
            __resolveType: 'Photo',
            ...photo,
          });
        }
      }
      return extras;
    }
    case NOTIFICATION_ACTION.DOMAIN_CONNECTION_SUCCESS:
    case NOTIFICATION_ACTION.DOMAIN_VERIFICATION_STARTED:
    case NOTIFICATION_ACTION.DOMAIN_DNS_ERRORS_FOUND:
    case NOTIFICATION_ACTION.DOMAIN_CONNECTION_FAILING:
    case NOTIFICATION_ACTION.DOMAIN_CONNECTION_FAILED:
    case NOTIFICATION_ACTION.QUEST_LOSERS_SELECTED:
    case NOTIFICATION_ACTION.QUEST_STARTED:
    case NOTIFICATION_ACTION.PHOTOGRAPHER_FEATURED:
    case NOTIFICATION_ACTION.LICENSING_SUGGEST_MULTIPLE:
    case NOTIFICATION_ACTION.LICENSING_CR_EXPIRING_USER:
    default:
      return [];
  }
};
// hydrateExtra END

// hydrateHeader START
const getNotificationIcon = (iconSlug) => ({
  __resolveType: 'NotificationIcon',
  src: `https://static.500px.net/icons/notifications/${iconSlug}`,
});

export const hydrateHeader = async (notification, allNodes) => {
  const {users} = allNodes;
  const {action, __raw} = notification;
  const {actors} = __raw;

  switch (action) {
    case NOTIFICATION_ACTION.FOLLOW_USER:
    case NOTIFICATION_ACTION.PHOTO_LIKE:
    case NOTIFICATION_ACTION.PHOTO_ADDED_TO_GALLERY:
    case NOTIFICATION_ACTION.PHOTO_COMMENT:
    case NOTIFICATION_ACTION.PHOTO_COMMENT_MENTION: {
      return getListNodesFromArray(DATA_TYPE.USER, actors, users).reduce((result, user) => {
        if (user) {
          result.push({
            ...user,
            __resolveType: 'User',
          });
        }
        return result;
      }, []);
    }
    case NOTIFICATION_ACTION.REACHED_POPULAR: {
      return [getNotificationIcon('popular_icon.png')];
    }
    case NOTIFICATION_ACTION.REACHED_UPCOMING: {
      return [getNotificationIcon('upcoming_icon.png')];
    }
    case NOTIFICATION_ACTION.SELECTED_BY_EDITOR: {
      return [getNotificationIcon('editors_choice_icon.png')];
    }
    case NOTIFICATION_ACTION.PHOTO_SELECTED_FOR_SHORTLIST:
    case NOTIFICATION_ACTION.QUEST_LOSERS_SELECTED:
    case NOTIFICATION_ACTION.QUEST_STARTED: {
      return [getNotificationIcon('quest_icon.png')];
    }
    case NOTIFICATION_ACTION.QUEST_WINNERS_SELECTED: {
      return [getNotificationIcon('quest_winner_icon.png')];
    }
    case NOTIFICATION_ACTION.LICENSING_UNDER_REVIEW:
    case NOTIFICATION_ACTION.LICENSING_CHANGE_REQUIRED:
    case NOTIFICATION_ACTION.PHOTO_ACCEPTED_TO_LICENSING:
    case NOTIFICATION_ACTION.LICENSING_DECLINED:
    case NOTIFICATION_ACTION.LICENSING_RELEASE_REQUIRED:
    case NOTIFICATION_ACTION.LICENSING_MODEL_RELEASE_SIGNED:
    case NOTIFICATION_ACTION.LICENSING_MODEL_RELEASE_REJECTED:
    case NOTIFICATION_ACTION.LICENSING_SUGGEST:
    case NOTIFICATION_ACTION.LICENSING_SUGGEST_MULTIPLE:
    case NOTIFICATION_ACTION.LICENSING_CR_TWO_WEEKS:
    case NOTIFICATION_ACTION.LICENSING_CR_THREE_MONTHS:
    case NOTIFICATION_ACTION.LICENSING_CR_SIX_MONTHS:
    case NOTIFICATION_ACTION.LICENSING_CR_REMAIN_TWO_WEEKS:
    case NOTIFICATION_ACTION.LICENSING_CR_EXPIRING_USER: {
      return [getNotificationIcon('licensing_icon.png')];
    }
    case NOTIFICATION_ACTION.DOMAIN_CONNECTION_SUCCESS:
    case NOTIFICATION_ACTION.DOMAIN_VERIFICATION_STARTED:
    case NOTIFICATION_ACTION.DOMAIN_DNS_ERRORS_FOUND:
    case NOTIFICATION_ACTION.DOMAIN_CONNECTION_FAILING:
    case NOTIFICATION_ACTION.DOMAIN_CONNECTION_FAILED: {
      return [getNotificationIcon('portfolio_icon.png')];
    }
    case NOTIFICATION_ACTION.PHOTOGRAPHER_FEATURED: {
      return [getNotificationIcon('featured_photographer_icon.png')];
    }
    default:
      return [];
  }
};
// hydrateHeader END

// hydrateLink START
const QUEST_LINK = {
  BRIEF: 'BRIEF',
  SHORTLIST: 'SHORTLIST',
};

const getProfileLink = (user) => {
  if (user && user.active !== 2) {
    return userResolver.User.canonicalPathV2({username: user.username});
  } else {
    return '';
  }
};

const getPhotoLink = async (photo) => {
  if (photo) {
    const {__uploaderUserId, name, __internalId} = photo;
    return await photoResolver.Photo.canonicalPath({__uploaderUserId, name, __internalId}, {}, {});
  } else {
    return '';
  }
};

const getGalleryLink = async (gallery, dataSources) => {
  if (gallery && dataSources) {
    const {__creatorUserId, publicSlug, privateToken, privacy} = gallery;
    const canonicalPath = await galleryResolver.Gallery.canonicalPath({__creatorUserId, publicSlug, privateToken, privacy}, {}, {dataSources});
    if (canonicalPath.startsWith('/p/')) return canonicalPath;
    if (canonicalPath.startsWith('/g/')) return canonicalPath;
    return `/p${canonicalPath}`;
  } else {
    return '';
  }
};

const getQuestLink = async (quest, questTab) => {
  if (quest) {
    const {__internalId, slug} = quest;
    const canonicalPath = await questResolver.Quest.canonicalPath({__internalId, slug});
    switch (questTab) {
      case QUEST_LINK.SHORTLIST:
        return `${canonicalPath}?view=shortlist`;
      case QUEST_LINK.BRIEF:
      default:
        return `${canonicalPath}?view=brief`;
    }
  } else {
    return '';
  }
};

const getLicensingManagerLink = () => '/licensing_manager';

const getPortfolioDomainSettingsLink = () => '/portfolio/settings/domain';

const getLicensingSuggestLink = () => '/manager?view=photos&filter=suggest';

const getLicensingChangeRequiredLink = () => '/manager?view=licensing&filter=change_required';

const getLicensingPendingLink = () => '/manager?view=licensing&filter=pending';

const getLicensingAcceptedLink = () => '/manager?view=licensing&filter=accepted';

const getSubNotificationsAction = () => 'action::mySubNotifications';

export const hydrateLink = async (notification, allNodes, dataSources) => {
  const {photos, users, quests, galleries} = allNodes;
  const {action, grouped, subNotificationInfo, __raw} = notification;
  const groupedType = subNotificationInfo && subNotificationInfo.groupedType;
  const {actors, actees} = __raw;

  switch (action) {
    case NOTIFICATION_ACTION.FOLLOW_USER: {
      // link to: follower profile
      let links;
      if (!grouped) {
        const user = getFirstNodeFromArray(DATA_TYPE.USER, actors, users);
        links = [getProfileLink(user)];
      } else {
        links = [getSubNotificationsAction()];
      }
      return links;
    }
    case NOTIFICATION_ACTION.PHOTO_LIKE: {
      // link to: liker profile, photo
      let links;
      if (!grouped) {
        const user = getFirstNodeFromArray(DATA_TYPE.USER, actors, users);
        const photo = getFirstNodeFromArray(DATA_TYPE.PHOTO, actees, photos);
        links = [getProfileLink(user), await getPhotoLink(photo)];
      } else {
        if (groupedType === GROUPED_TYPE.PHOTO_LIKE_PHOTOS) {
          const user = getFirstNodeFromArray(DATA_TYPE.USER, actors, users);
          links = [getProfileLink(user), getSubNotificationsAction()];
        } else if (groupedType === GROUPED_TYPE.PHOTO_LIKE_USERS) {
          const photo = getFirstNodeFromArray(DATA_TYPE.PHOTO, actees, photos);
          links = [getSubNotificationsAction(), await getPhotoLink(photo)];
        }
      }

      return links;
    }
    case NOTIFICATION_ACTION.PHOTO_ADDED_TO_GALLERY: {
      // Link to: adder profile, added to gallery
      const user = getFirstNodeFromArray(DATA_TYPE.USER, actors, users);
      const links = [getProfileLink(user)];
      if (!grouped) {
        const gallery = getFirstNodeFromArray(DATA_TYPE.GALLERY, actees, galleries);
        links.push(await getGalleryLink(gallery, dataSources));
      } else {
        links.push(getSubNotificationsAction());
      }
      return links;
    }
    case NOTIFICATION_ACTION.PHOTO_COMMENT:
    case NOTIFICATION_ACTION.PHOTO_COMMENT_MENTION: {
      // link to: commenter profile, photo's comment section
      const user = getFirstNodeFromArray(DATA_TYPE.USER, actors, users);
      const photo = getFirstNodeFromArray(DATA_TYPE.PHOTO, actees, photos);
      return [getProfileLink(user), await getPhotoLink(photo)];
    }
    case NOTIFICATION_ACTION.REACHED_POPULAR:
    case NOTIFICATION_ACTION.REACHED_UPCOMING:
    case NOTIFICATION_ACTION.SELECTED_BY_EDITOR:
    case NOTIFICATION_ACTION.PHOTOGRAPHER_FEATURED: {
      // link to: photo
      const photo = getFirstNodeFromArray(DATA_TYPE.PHOTO, actors, photos);
      return [await getPhotoLink(photo)];
    }
    case NOTIFICATION_ACTION.PHOTO_SELECTED_FOR_SHORTLIST: {
      // link to: quest shortlist
      const quest = getFirstNodeFromArray(DATA_TYPE.QUEST, actors, quests);
      return [await getQuestLink(quest, QUEST_LINK.SHORTLIST)];
    }
    case NOTIFICATION_ACTION.QUEST_LOSERS_SELECTED:
    case NOTIFICATION_ACTION.QUEST_WINNERS_SELECTED:
    case NOTIFICATION_ACTION.QUEST_STARTED: {
      // link to: quest brief
      const quest = getFirstNodeFromArray(DATA_TYPE.QUEST, actors, quests);
      return [await getQuestLink(quest, QUEST_LINK.BRIEF)];
    }
    case NOTIFICATION_ACTION.LICENSING_UNDER_REVIEW: {
      return [getLicensingPendingLink()];
    }
    case NOTIFICATION_ACTION.LICENSING_CHANGE_REQUIRED: {
      return [getLicensingChangeRequiredLink()];
    }
    case NOTIFICATION_ACTION.PHOTO_ACCEPTED_TO_LICENSING: {
      return [getLicensingAcceptedLink()];
    }
    case NOTIFICATION_ACTION.LICENSING_DECLINED:
    case NOTIFICATION_ACTION.LICENSING_RELEASE_REQUIRED:
    case NOTIFICATION_ACTION.LICENSING_MODEL_RELEASE_SIGNED:
    case NOTIFICATION_ACTION.LICENSING_MODEL_RELEASE_REJECTED: {
      return [getLicensingManagerLink()];
    }
    case NOTIFICATION_ACTION.LICENSING_SUGGEST_MULTIPLE: {
      return [getLicensingSuggestLink()];
    }
    case NOTIFICATION_ACTION.LICENSING_SUGGEST: {
      let links;
      if (!grouped) {
        links = [getLicensingSuggestLink()];
      } else {
        links = [getLicensingSuggestLink(), getSubNotificationsAction()];
      }
      return links;
    }
    case NOTIFICATION_ACTION.LICENSING_CR_TWO_WEEKS:
    case NOTIFICATION_ACTION.LICENSING_CR_THREE_MONTHS:
    case NOTIFICATION_ACTION.LICENSING_CR_SIX_MONTHS:
    case NOTIFICATION_ACTION.LICENSING_CR_REMAIN_TWO_WEEKS: {
      let links;
      if (!grouped) {
        links = [getLicensingChangeRequiredLink()];
      } else {
        links = [getLicensingChangeRequiredLink(), getSubNotificationsAction()];
      }
      return links;
    }
    case NOTIFICATION_ACTION.LICENSING_CR_EXPIRING_USER: {
      return [getLicensingChangeRequiredLink()];
    }
    case NOTIFICATION_ACTION.DOMAIN_CONNECTION_SUCCESS:
    case NOTIFICATION_ACTION.DOMAIN_VERIFICATION_STARTED:
    case NOTIFICATION_ACTION.DOMAIN_DNS_ERRORS_FOUND:
    case NOTIFICATION_ACTION.DOMAIN_CONNECTION_FAILING:
    case NOTIFICATION_ACTION.DOMAIN_CONNECTION_FAILED: {
      return [getPortfolioDomainSettingsLink()];
    }
    default:
      return [];
  }
};
// hydrateLink END

// hydrateContent START
const getContentString = (template, args) => (args || []).reduce((temp, arg, index) => temp.replace(`$[${index}]`, arg), template);

const getDisplaynameFromUsers = (userId, users) => {
  const user = userId && getNodeFromArray(parseInt(userId), users);
  if (user) {
    const displayname = `${user.firstName || ''} ${user.lastName || ''}`.trim();
    return displayname ? displayname : user.username;
  }
  return 'Deleted User';
};

const getGalleryNameFromGalleries = (galleryId, galleries) => {
  const gallery = galleryId && getNodeFromArray(parseInt(galleryId), galleries);
  return gallery ? (gallery.name || '').trim() : 'Deleted Gallery';
};

const getCommentBodyFromComments = (commentId, comments) => {
  const comment = commentId && getNodeFromArray(parseInt(commentId), comments);
  return comment ? (comment.body || '').trim() : 'Deleted Comment';
};

const getQuestTitleFromQuests = (questId, quests) => {
  const quest = questId && getNodeFromArray(parseInt(questId), quests);
  return quest ? (quest.title || '').trim() : 'Deleted Quest';
};

const getModelReleaseFilenameFromModelReleases = (modelReleaseId, modelReleases) => {
  const modelRelease = modelReleaseId && getNodeFromArray(parseInt(modelReleaseId), modelReleases);
  return modelRelease ? (modelRelease.filename || '').trim() : 'Deleted Model Release';
};

const getDomainNameFromDomains = (domainId, domains) => {
  const domain = domainId && getNodeFromArray(parseInt(domainId), domains);
  return domain ? (domain.fqdn || '').trim() : 'Deleted Domain';
};

const getArgs = (actionObjects, nodes) => (actionObjects || []).map((a) => {
  const type = a.type;
  if (type === DATA_TYPE.TEXT) {
    return {
      type,
      value: a.text,
    };
  }
  let value;
  switch (type) {
    case DATA_TYPE.USER:
      value = getDisplaynameFromUsers(parseInt(a.id), nodes.users);
      break;
    case DATA_TYPE.GALLERY:
      value = getGalleryNameFromGalleries(parseInt(a.id), nodes.galleries);
      break;
    case DATA_TYPE.COMMENT:
      value = getCommentBodyFromComments(parseInt(a.id), nodes.comments);
      break;
    case DATA_TYPE.QUEST:
      value = getQuestTitleFromQuests(parseInt(a.id), nodes.quests);
      break;
    case DATA_TYPE.MODELRELEASE:
      value = getModelReleaseFilenameFromModelReleases(parseInt(a.id), nodes.modelReleases);
      break;
    case DATA_TYPE.DOMAIN:
      value = getDomainNameFromDomains(parseInt(a.id), nodes.domains);
      break;
    default:
  }
  return {
    type,
    value,
  };
});

export const hydrateContent = async (notification, allNodes) => {
  const {action, grouped, subNotificationInfo, __raw} = notification;
  const groupedType = subNotificationInfo && subNotificationInfo.groupedType;
  const {contentTemplate, actors, actees} = __raw;
  let args;

  switch (action) {
    case NOTIFICATION_ACTION.PHOTO_LIKE: {
      const actionObjects = [].concat(actors);
      if (grouped && groupedType === GROUPED_TYPE.PHOTO_LIKE_PHOTOS) {
        actionObjects.push(actees.find((a) => a.type === DATA_TYPE.TEXT));
        args = getArgs(actionObjects, allNodes).map((a) => a.type === DATA_TYPE.TEXT ? a.value : `**${a.value}**`);
      } else {
        args = getArgs(actionObjects, allNodes).map((a) => `**${a.value}**`);
      }
      break;
    }
    case NOTIFICATION_ACTION.PHOTO_ADDED_TO_GALLERY: {
      let actionObjects = [].concat(actors);
      if (!grouped) {
        actionObjects.push(actees.find((a) => a.type === DATA_TYPE.GALLERY));
      } else {
        if (groupedType === GROUPED_TYPE.PHOTO_ADD_TO_GALLERY_PHOTOS) {
          actionObjects.push(actees.find((a) => a.type === DATA_TYPE.TEXT));
          actionObjects.push(actees.find((a) => a.type === DATA_TYPE.GALLERY));
        } else if (groupedType === GROUPED_TYPE.PHOTO_ADD_TO_GALLERY_GALLERIES) {
          actionObjects = actionObjects.concat(actees.filter((a) => a.type === DATA_TYPE.TEXT));
        }
      }
      args = getArgs(actionObjects, allNodes).map((a) => a.type === DATA_TYPE.TEXT ? a.value : `**${a.value}**`);
      break;
    }
    case NOTIFICATION_ACTION.PHOTO_COMMENT:
    case NOTIFICATION_ACTION.PHOTO_COMMENT_MENTION: {
      const actionObjects = [].concat(actors);
      actionObjects.push(actees.find((a) => a.type === DATA_TYPE.COMMENT));
      args = getArgs(actionObjects, allNodes).map((a) => a.type === DATA_TYPE.COMMENT ? a.value : `**${a.value}**`);
      break;
    }
    case NOTIFICATION_ACTION.REACHED_POPULAR:
    case NOTIFICATION_ACTION.REACHED_UPCOMING:
    case NOTIFICATION_ACTION.SELECTED_BY_EDITOR:
    case NOTIFICATION_ACTION.PHOTOGRAPHER_FEATURED: {
      const actionObjects = [actees.find((a) => a.type === DATA_TYPE.TEXT)];
      args = getArgs(actionObjects, allNodes).map((a) => `**${a.value}**`);
      break;
    }
    case NOTIFICATION_ACTION.FOLLOW_USER:
    // Quest fetch actions
    case NOTIFICATION_ACTION.PHOTO_SELECTED_FOR_SHORTLIST:
    case NOTIFICATION_ACTION.QUEST_LOSERS_SELECTED:
    case NOTIFICATION_ACTION.QUEST_WINNERS_SELECTED:
    case NOTIFICATION_ACTION.QUEST_STARTED:
    // Domain actions
    case NOTIFICATION_ACTION.DOMAIN_CONNECTION_SUCCESS:
    case NOTIFICATION_ACTION.DOMAIN_VERIFICATION_STARTED:
    case NOTIFICATION_ACTION.DOMAIN_DNS_ERRORS_FOUND:
    case NOTIFICATION_ACTION.DOMAIN_CONNECTION_FAILING:
    case NOTIFICATION_ACTION.DOMAIN_CONNECTION_FAILED: {
      const actionObjects = [].concat(actors);
      args = getArgs(actionObjects, allNodes).map((a) => `**${a.value}**`);
      break;
    }
    case NOTIFICATION_ACTION.LICENSING_MODEL_RELEASE_SIGNED:
    case NOTIFICATION_ACTION.LICENSING_MODEL_RELEASE_REJECTED: {
      const actionObjects = [actees.find((a) => a.type === DATA_TYPE.MODELRELEASE)];
      args = getArgs(actionObjects, allNodes).map((a) => `**${a.value}**`);
      break;
    }
    // Licensing actions
    case NOTIFICATION_ACTION.LICENSING_CHANGE_REQUIRED:
    case NOTIFICATION_ACTION.PHOTO_ACCEPTED_TO_LICENSING:
    case NOTIFICATION_ACTION.LICENSING_UNDER_REVIEW:
    case NOTIFICATION_ACTION.LICENSING_DECLINED:
    case NOTIFICATION_ACTION.LICENSING_RELEASE_REQUIRED:
    case NOTIFICATION_ACTION.LICENSING_SUGGEST:
    case NOTIFICATION_ACTION.LICENSING_SUGGEST_MULTIPLE:
    case NOTIFICATION_ACTION.LICENSING_CR_TWO_WEEKS:
    case NOTIFICATION_ACTION.LICENSING_CR_THREE_MONTHS:
    case NOTIFICATION_ACTION.LICENSING_CR_SIX_MONTHS:
    case NOTIFICATION_ACTION.LICENSING_CR_REMAIN_TWO_WEEKS:
    case NOTIFICATION_ACTION.LICENSING_CR_EXPIRING_USER:
    default:
      args = [];
  }

  return getContentString(contentTemplate, args);
};
// hydrateContent END
