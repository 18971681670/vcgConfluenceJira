import {logger} from '../../utils/logger';

const ACTIONS_WITHOUT_ACTOR = [
  'QUEST_STARTED',
  'QUEST_LOSERS_SELECTED',
  'QUEST_WINNERS_SELECTED',
  'PHOTO_SELECTED_FOR_SHORTLIST',
  'GALLERY_SELECTED_BY_EDITOR',
  'SELECTED_BY_EDITOR',
  'RESOURCE_FEATURED',
];

/**
 * Generate payload to be consumed by resolvers
 * @param {*} node Grouped Notification
 * @param {*} dataSources Data Source
 * @return {*} Payload
 */
export function processGroupedNotification(node, dataSources) {
  let itemsPromise = [];

  const {
    __itemInternalIds,
    actions,
  } = node;
  let __itemTypename = node.__itemTypename;

  const noActorNeeded = !!actions.find((action) => ACTIONS_WITHOUT_ACTOR.includes(action));
  const __actorUserIds = noActorNeeded ? [] : node.__actorUserIds;

  switch (__itemTypename) {
    case 'GroupedNotificationItemPhotoComment':
      itemsPromise = Promise.all(__itemInternalIds.map(async (obj) => {
        const [
          photo,
          comment,
        ] = await Promise.all([
          dataSources.Photo.photo.findByInternalId(obj.photo),
          dataSources.Commenting.comment.findByInternalId(obj.comment),
        ]);

        if (photo && comment) {
          return {
            photo,
            comment,
          };
        } else {
          return null;
        }
      }));
      break;
    case 'GroupedNotificationItemGalleryItem':
      itemsPromise = Promise.all(__itemInternalIds.map(async (obj) => {
        const [
          photo,
          gallery,
        ] = await Promise.all([
          dataSources.Photo.photo.findByInternalId(obj.photo),
          dataSources.Gallery.gallery.findByInternalId(obj.gallery),
        ]);

        if (photo && gallery) {
          return {
            photo,
            gallery,
          };
        } else {
          return null;
        }
      }));
      break;
    case 'GroupedNotificationItemPhotoQuest':
      itemsPromise = Promise.all(__itemInternalIds.map(async (obj) => {
        const [
          photo,
          quest,
        ] = await Promise.all([
          dataSources.Photo.photo.findByInternalId(obj.photo),
          dataSources.Quest.quest.findByInternalId(obj.quest),
        ]);

        if (photo && quest) {
          return {
            photo,
            quest,
          };
        } else {
          return null;
        }
      }));
      break;
    case 'GroupedNotificationItemQuestPhoto':
      itemsPromise = Promise.all(__itemInternalIds.map(async (obj) => {
        const [
          quest,
          photo,
        ] = await Promise.all([
          dataSources.Quest.quest.findByInternalId(obj.quest),
          dataSources.Photo.photo.findByInternalId(obj.photo),
        ]);

        // photo is optional for quest winner notifications
        if (quest) {
          return {
            quest,
            photo,
          };
        } else {
          return null;
        }
      }));
      break;
    case 'Photo':
      itemsPromise = dataSources.Photo.photo.findByInternalIds(__itemInternalIds);
      break;
    case 'User':
      itemsPromise = dataSources.UserCenter.user.findByInternalIds(__itemInternalIds);
      break;
    case 'Quest':
      /*
       * ["1000000099",{"quest": "1000000099","photo": "1013673521"}]
       * 处理特殊数据
       */
      const _questIds = Array.from(new Set(__itemInternalIds.map((t) => isNaN(t) ? t.quest : t)));
      itemsPromise = dataSources.Quest.quest.findByInternalIds(_questIds);
      break;
    case 'Resource':
      itemsPromise = dataSources.Resource.resource.findByInternalIds(__itemInternalIds).then((obj) => {
        // All resource related notifications should be ungroupable, thus will only have one obj returned
        __itemTypename = obj[0].__resolveType;
        return obj;
      });
      break;
    case 'CustomDomain':
      itemsPromise = dataSources.Domain.customDomain.findByInternalIds(__itemInternalIds);
      break;
    default:
      break;
  }

  const actorsPromise = dataSources.UserCenter.user.findByInternalIds(__actorUserIds);

  return {
    actors: async () => {
      return (await actorsPromise).filter((i) => i);
    },
    items: async () => {
      return (await itemsPromise).filter((i) => i).map((i) => {
        return {
          ...i,
          __itemTypename,
        };
      });
    },
    __isDiplayablePromise: async () => {
      const [
        actors,
        items,
      ] = await Promise.all([
        actorsPromise,
        itemsPromise,
      ]);
      const hasActors = !!(actors.find((i) => i));
      const hasItems = !!(items.find((i) => i));
      return (noActorNeeded || hasActors) && hasItems;
    },
  };
}

export const resolvers = {
  GroupedNotification: {
    actors: async (parent, _, {dataSources}) => {
      const {actors} = processGroupedNotification(parent, dataSources);
      return await actors();
    },

    items: async (parent, _, {dataSources}) => {
      const {items} = processGroupedNotification(parent, dataSources);
      return await items();
    },
  },

  GroupedNotificationItem: {
    __resolveType: ({__itemTypename}) => {
      return __itemTypename;
    },
  },
};
