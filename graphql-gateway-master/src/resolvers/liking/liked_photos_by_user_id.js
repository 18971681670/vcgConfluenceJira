import {btoa, atob} from '../../utils/base64';

const getPhotos = async ({after, first, sort, dataSources, currentUserId}, recursionsCount = 0, accumulatedEdges = []) => {
  // Arbitrarily setting max recursions to 5 - change/optimize as needed
  const MAX_RECURSIONS = 5;
  // Arbitrarily setting the absolute minimum to 5 or half of `first` - change/optimize as needed
  const MIN_PHOTOS_COUNT = first / 2 > 5 ? first / 2 : 5;

  const dynamoDbCursor = after ? atob(after).split(',')[1] : undefined;

  const {photoIds, lastPageCursor} = await dataSources.Liking.likedPhotos.paginatedLikedPhotoIdsList({dynamoDbCursor, pageSize: first, sort}, currentUserId);

  // If the query size is greater than the number of returned items, lastPageCursor will be falsy
  const hasNextPage = !!lastPageCursor;

  const photos = photoIds.length > 0 ? await dataSources.Photo.photo.findByInternalIds(photoIds) : [];

  // Save the cursor of the last photo id in this set regardless of the photo's visibility status
  const endCursor = photoIds.length > 0 ? btoa(`${photoIds[photoIds.length - 1]},${lastPageCursor}`) : null;

  // Filter out null photos
  const filterPhotos = photos.filter((photo) => photo && photo.legacyId);

  const filterEdges = filterPhotos.map((photo) => {
    return {
      node: photo,
      cursor: btoa(`${photo.legacyId},${lastPageCursor}`),
    };
  });
  const edges = [...accumulatedEdges, ...filterEdges];

  const pageInfo = {
    hasNextPage,
    hasPreviousPage: after ? true : false,
    startCursor: edges.length > 0 ? edges[0].cursor : null,
    endCursor,
  };

  if (recursionsCount <= MAX_RECURSIONS && edges.length < MIN_PHOTOS_COUNT && hasNextPage) {
    const nextAfter = pageInfo.endCursor;
    return await getPhotos({after: nextAfter, first, sort, dataSources, currentUserId}, recursionsCount + 1, edges);
  }

  return {edges, pageInfo};
};

const pageLikedResource = async ({after, first, sort, filter, search, dataSources, currentUserId}, recursionsCount = 0, accumulatedEdges = []) => {
  // Arbitrarily setting max recursions to 5 - change/optimize as needed
  const MAX_RECURSIONS = 5;
  // Arbitrarily setting the absolute minimum to 5 or half of `first` - change/optimize as needed
  const MIN_PHOTOS_COUNT = first / 2 > 5 ? first / 2 : 5;

  const dynamoDbCursor = after ? atob(after).split(',')[1] : undefined;

  const {resourceIds, lastPageCursor} = await dataSources.Liking.likedPhotos.paginatedLikedResourceList({dynamoDbCursor, pageSize: first, sort, filter}, currentUserId);

  // If the query size is greater than the number of returned items, lastPageCursor will be falsy
  const hasNextPage = !!lastPageCursor;
  let filterNsfw=false;
  if (search) {
    filterNsfw=search.some((k) =>{
      return k.key === 'NSFW' && k.value === 'false';
    });
  }

  let resourceList=[];
  if (resourceIds.length>0) {
    switch (filter) {
      case 'PHOTO':
        resourceList= await dataSources.Photo.photo.findByInternalIds(resourceIds);
        if (filterNsfw) {
          resourceList=resourceList.filter((resource) => resource && !resource.notSafeForWork);
        }
        break;
      case 'PHOTO_STORIES':
        resourceList=await dataSources.Story.story.getByIds(resourceIds);
        if (filterNsfw) {
          resourceList=resourceList.filter((resource) => resource && !resource.notSafeForWork);
        }
        break;
      case 'MOOD_GALLERY':
        resourceList=await dataSources.MoodGallery.moodGallery.getByIds(resourceIds);
        break;
      case 'FEATURED_GALLERIES':
        resourceList=await dataSources.Gallery.gallery.findByInternalIds(resourceIds);
        if (filterNsfw) {
          resourceList=resourceList.filter((resource) => resource && !resource.notSafeForWork);
        }
        break;
      default:
        break;
    }
  }

  // Save the cursor of the last photo id in this set regardless of the photo's visibility status
  const endCursor = resourceIds.length > 0 ? btoa(`${resourceIds[resourceIds.length - 1]},${lastPageCursor}`) : null;

  // Filter out null photos
  const filterResourceList = resourceList.filter((resource) => resource && resource.legacyId);

  const filterEdges = filterResourceList.map((photo) => {
    return {
      node: photo,
      cursor: btoa(`${photo.legacyId},${lastPageCursor}`),
    };
  });

  const edges = [...accumulatedEdges, ...filterEdges];

  const pageInfo = {
    hasNextPage,
    hasPreviousPage: after ? true : false,
    startCursor: edges.length > 0 ? edges[0].cursor : null,
    endCursor,
  };

  if (recursionsCount <= MAX_RECURSIONS && edges.length < MIN_PHOTOS_COUNT && hasNextPage) {
    const nextAfter = pageInfo.endCursor;
    return await pageLikedResource({after: nextAfter, first, sort, filter, dataSources, currentUserId}, recursionsCount + 1, edges);
  }

  return {edges, pageInfo};
};

export const resolvers = {
  Query: {
    likedPhotos: async (_, {after, first, sort}, {dataSources, currentUserId}) => {
      const {edges, pageInfo} = await getPhotos({after, first, sort, dataSources, currentUserId});
      // TODO: will be refactored/removed as part of tracking service redesign
      await dataSources.Photo.photoViewCount.incrementViewCount(edges.map((edge) => edge.node.__internalId));

      return {edges, pageInfo};
    },
    pageLikedResource: async (_, {after, first, sort, filter, search}, {dataSources, currentUserId}) => {
      const {edges, pageInfo} = await pageLikedResource({after, first, sort, filter, search, dataSources, currentUserId});
      const resourceType=filter;
      return {edges, pageInfo, resourceType};
    },
  },
  LikedResourceItem: {
    __resolveType({__resolveType}) {
      /*
       * Resolves the specific item type passed in
       * so __resolveType: 'Gallery' will call the Gallery resolver, etc
       */
      return __resolveType;
    },
  },
};
