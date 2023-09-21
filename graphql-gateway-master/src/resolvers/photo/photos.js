import {
  loadSqlBasedConnectionFields,
} from '../helpers';

const getPhotos = async (
  first,
  after,
  last,
  before,
  sourceType,
  dataService,
  inclusive,
  inGallery,
  dataSources,
  legacyId,
  recursionsCount = 0,
) => {
  const MAX_RECURSIONS = 2;

  const previous = before ? true : false;
  const cursor = before ? before : after ? after : '';
  const size = before ? last : first;

  const {
    photoIds,
    cursors,
    totalCount,
    pageInfo,
  } = await dataSources[sourceType][dataService].cursorPaginatedPhotoIdList({size, previous, cursor, legacyId, inclusive});

  const cursorPagination = pageInfo;

  if (totalCount === 0) {
    return {
      nodes: [],
      cursors: [],
      totalCount,
      cursorPagination: {
        hasNextPage: pageInfo.hasNextPage,
        hasPreviousPage: pageInfo.hasPreviousPage,
      },
    };
  };

  const nodes = inGallery ?
      await dataSources.Photo.photo.findByInternalIdsInGallery(photoIds) :
      await dataSources.Photo.photo.findByInternalIds(photoIds);

  /*
   * if an array of all null photos is returned, photo page can't advance to the next photo
   * this tries another 2 queries to get some existant photos
   * MAX_RECURSIONS can be increased if bugs still occur
   */
  const isAllNodesNull = nodes.every((node) => node === null);
  const hasMorePages = before ? pageInfo.hasPreviousPage : pageInfo.hasNextPage;

  if (recursionsCount <= MAX_RECURSIONS && hasMorePages && isAllNodesNull) {
    const nextAfter = after ? pageInfo.endCursor : null;
    const nextBefore = before ? pageInfo.startCursor : null;
    return await getPhotos(first, nextAfter, last, nextBefore, sourceType, dataService, inclusive, inGallery, dataSources, legacyId, recursionsCount + 1);
  }

  return {
    nodes,
    cursors,
    totalCount,
    cursorPagination,
  };
};

export const resolvers = {
  Query: {
    photos: async (_, {first, after, last, before, serviceName, serviceLegacyId, inspirationGalleryId, inclusive, countPhotoView}, {dataSources}) => {
      let sourceType = null;
      let dataService = null;
      let legacyId = serviceLegacyId;
      let inGallery = false; // LIMITED_ACCESS photos accessible in galleries

      switch (serviceName) {
        case 'USER_PROFILE':
          sourceType = 'Photo';
          dataService = 'userPhotos';
          break;
        case 'GALLERY':
          sourceType = 'Gallery';
          dataService = 'photosOnGallery';
          inGallery = true;
          break;
        case 'QUEST_INSPIRATION':
          // Note: Quest inspiration photos are a loaded from a hidden gallery
          sourceType = 'Gallery';
          dataService = 'photosOnGallery';
          const quests = await dataSources.Quest.quest.bulkLoadData([serviceLegacyId]);
          legacyId = (quests.length > 0) ? quests[0].sample_gallery_id : null;
          inGallery = true;
          break;
        case 'HOMEFEED':
          sourceType = 'Homefeed';
          dataService = 'homefeed';
        default:
          break;
      };

      if (inspirationGalleryId && !legacyId) {
        legacyId = inspirationGalleryId;
      }
      if (!sourceType || !dataService || !legacyId) {
        return {
          edges: [],
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
            endCursor: null,
            startCursor: null,
          },
          totalCount: 0,
        };
      }

      const loadConnection = loadSqlBasedConnectionFields(
          {first, after, last, before, overridePagination: true},
          async () => await getPhotos(first, after, last, before, sourceType, dataService, inclusive, inGallery, dataSources, legacyId),
      );
      const {edges, pageInfo, totalCount} = await loadConnection();
      if (countPhotoView) {
        const trackIds = edges.map((item) => item.__internalId);
        await dataSources.Photo.photoViewCount.incrementViewCount(trackIds);
      }
      return {
        edges,
        pageInfo,
        totalCount,
      };
    },
  },
};
