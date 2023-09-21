import {atob, btoa} from '../../utils/base64';
import {hydrateHeader, hydrateLink, hydrateContent, hydrateExtra} from './hydration_helpers';

const emptyResponse = {
  edges: [],
  pageInfo: {
    hasNextPage: false,
    hasPreviousPage: false,
    startCursor: null,
    endCursor: null,
  },
  totalCount: 0,
  haveUnread: false,
};

const hydrateNotifications = async (notifications, allNodes, dataSources) => {
  const edges = await Promise.all(notifications.map(async (notification) => {
    const subNotificationInfo = notification.subNotificationInfo;
    if (!!subNotificationInfo) {
      subNotificationInfo.endCursor = btoa(subNotificationInfo.endCursor);
      subNotificationInfo.startCursor = btoa(subNotificationInfo.startCursor);
    }
    const hydratedContent = await hydrateContent(notification, allNodes);
    const hydratedLink = await hydrateLink(notification, allNodes, dataSources);
    const hydratedHeaders = await hydrateHeader(notification, allNodes);
    const hydratedExtras = await hydrateExtra(notification, allNodes);

    const edge = {
      cursor: btoa(`${notification.legacyId}`),
      node: {
        ...notification,
        content: hydratedContent,
        headers: hydratedHeaders,
        extras: hydratedExtras,
        links: hydratedLink,
      },
    };
    return edge;
  }));

  return edges;
};

const resolveNotifications = async (dataSources, currentUserId, {buckets, haveUnread, notifications, exclusiveStartCursor}) => {
  if (!notifications || notifications.length === 0) {
    return emptyResponse;
  }

  // Add current user id to bucket
  buckets.userIds.add(currentUserId);
  const [photos, users, quests, comments, galleries, licensing, domains, modelReleases] = await Promise.allSettled([
    (buckets.photoIds.size > 0) ? dataSources.Photo.photo.findByInternalIds(Array.from(buckets.photoIds)) : [],
    (buckets.userIds.size > 0) ? dataSources.UserCenter.user.findByInternalIds(Array.from(buckets.userIds)) : [],
    (buckets.questIds.size > 0) ? dataSources.Quest.quest.findByInternalIds(Array.from(buckets.questIds)) : [],
    (buckets.commentIds.size > 0) ? dataSources.Commenting.comment.findByInternalIds(Array.from(buckets.commentIds)) : [],
    (buckets.galleryIds.size > 0) ? dataSources.Gallery.gallery.findByInternalIds(Array.from(buckets.galleryIds)) : [],
    (buckets.licensingIds.size > 0) ? dataSources.Licensing.licensingPhoto.findByInternalIds(Array.from(buckets.licensingIds)) : [],
    (buckets.domainIds.size > 0) ? dataSources.Domain.customDomain.findByInternalIds(Array.from(buckets.domainIds)) : [],
    (buckets.modelReleaseIds.size > 0) ? dataSources.Licensing.modelRelease.findByInternalIds(Array.from(buckets.modelReleaseIds)) : [],
  ]);

  const allNodes = {
    currentUser: users.value.find((user) => user && user.legacyId === parseInt(currentUserId)),
    photos: photos.value,
    users: users.value,
    quests: quests.value,
    comments: comments.value,
    galleries: galleries.value,
    licensing: licensing.value,
    domains: domains.value,
    modelReleases: modelReleases.value,
  };

  const edges = await hydrateNotifications(notifications, allNodes, dataSources);

  const pageInfo = {
    hasNextPage: !!exclusiveStartCursor,
    hasPreviousPage: false,
    startCursor: null,
    endCursor: !!exclusiveStartCursor ? btoa(exclusiveStartCursor) : null,
  };

  return {
    edges,
    pageInfo,
    haveUnread,
  };
};

export const resolvers = {
  Query: {
    myNotifications: async (_, {first, after, grouped}, {dataSources, currentUserId}) => {
      if (!currentUserId) {
        return emptyResponse;
      }

      const rpp = first;
      const from = after ? atob(after) : null;
      const notifications = await dataSources.Notification.notification.paginatedNotificationList({rpp, from, grouped});

      return resolveNotifications(dataSources, currentUserId, notifications);
    },
    mySubNotifications: async (_, {first, after, groupedType, groupedEndCursor}, {dataSources, currentUserId}) => {
      if (!currentUserId) {
        return emptyResponse;
      }

      const rpp = first;
      const from = after ? atob(after) : null;
      const endCursor = atob(groupedEndCursor);
      const notifications = await dataSources.Notification.notification.paginatedSubNotificationList({rpp, from, groupedType, endCursor});

      return resolveNotifications(dataSources, currentUserId, notifications);
    },
  },
};
