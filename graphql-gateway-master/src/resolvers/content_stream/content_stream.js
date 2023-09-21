import {logger} from '../../utils/logger';
import {
  generateToOneAssocationFieldResolver,
  loadSqlBasedConnectionFields,
} from '../helpers';


export const CATEGORIES = [
  'Abstract',
  'Aerial',
  'Animals',
  'Black and White',
  'Celebrities',
  'City & Architecture',
  'Commercial',
  'Concert',
  'Family',
  'Fashion',
  'Film',
  'Fine Art',
  'Food',
  'Journalism',
  'Landscapes',
  'Macro',
  'Nature',
  'Night',
  'Nude',
  'People',
  'Performing Arts',
  'Sport',
  'Still Life',
  'Street',
  'Transportation',
  'Travel',
  'Underwater',
  'Urban Exploration',
  'Wedding',
  'Uncategorized',
];

export const FEATURE_MAPPING = [
  'POPULAR_SECTION',
  'UPCOMING_SECTION',
  'FRESH_SECTION',
  'EDITORS_CHOICE_SECTION',
  'UNDISCOVERED',
];

export const resolvers = {
  ContentStream: {
    __resolveType: ({__resolveType}) => {
      return __resolveType;
    },
  },
  ContentStreamEditorsChoice: {
    selectedBy: generateToOneAssocationFieldResolver('selectedBy', 'UserCenter', 'User'),
  },

  Query: {
    featuresCoverPhoto: async (_, {includeCovers = []}, {dataSources}) => {
      const filteredFeatures = FEATURE_MAPPING.filter((feature) => {
        // if includeCovers is [] all features' cover photos will be included
        const isIncluded = includeCovers.length === 0 || includeCovers.includes(feature);
        const featureExists = !!FEATURE_MAPPING_CONFIG[feature];
        return isIncluded && featureExists;
      });

      const promisesArray = filteredFeatures.map((feature) => {
        return promiseFeaturesCoverPhoto(dataSources, feature, FEATURE_MAPPING_CONFIG[feature]);
      });
      const result = await Promise.all(promisesArray);
      const photoIds = [...new Set([].concat(...result.map((r) => r.__ids)))];
      let photos = photoIds.length > 0 ? await dataSources.Photo.photo.findByInternalIds(photoIds) : [];
      photos = await filterBlockedUser(dataSources, photos);
      const photoMap = new Map(photos.filter((p) => !!p).map((p) => [p.legacyId, p]));

      return result.map((r) => ({
        title: r.title,
        cover: photoMap.get(r.__ids.find((id) => !!photoMap.get(id))),
      }));
    },
    categoriesCoverPhoto: async (_, { }, {dataSources}) => {
      const promiseFunction = [];
      CATEGORIES.forEach((category) => {
        promiseFunction.push(promiseGetCategoryCoverPhoto(dataSources, category));
      });
      const result = await Promise.all(promiseFunction);
      const photoIds = [...new Set([].concat(...result.map((r) => r.__ids)))];
      let photos = photoIds.length > 0 ? await dataSources.Photo.photo.findByInternalIds(photoIds) : [];
      photos = await filterBlockedUser(dataSources, photos);
      const photoMap = new Map(photos.filter((p) => !!p).map((p) => [p.legacyId, p]));

      return result.map((r) => ({
        title: r.title,
        cover: photoMap.get(r.__ids.find((id) => !!photoMap.get(id))),
      }));
    },
    photoDiscoverSectionSearch: async (_, {first, after, discoverSectionType, personalizedCategories, categories}, {dataSources}) => {
      const loadConnection = loadSqlBasedConnectionFields({first, after}, async (legacyPagination) => {
        const {
          __ids,
          totalCount,
        } = await dataSources.ContentStream.contentStream.photoDiscoverSearch(
            legacyPagination,
            {discoverSectionType, personalizedCategories, categories},
        );

        let photos = [];
        if (__ids.length > 0) {
          photos = await dataSources.Photo.photo.findByInternalIds(__ids);
          photos = await filterBlockedUser(dataSources, photos);
        }

        // because bulkLoadData is not sort by __ids, also we need resort for finally result
        const photoMap = new Map();
        photos.forEach((res) => {
          if (res) {
            photoMap.set(res.legacyId, res);
          }
        });

        const retPhotos = [];
        __ids.forEach((id) => {
          const photo = photoMap.get(id);
          if (photo) {
            retPhotos.push(photo);
          }
        });

        return {
          nodes: retPhotos,
          totalCount,
        };
      });

      return {
        edges: async () => {
          const {edges} = await loadConnection();
          return edges;
        },
        pageInfo: async () => {
          const {pageInfo} = await loadConnection();
          return pageInfo;
        },
        totalCount: async () => {
          const {totalCount} = await loadConnection();
          return totalCount;
        },
      };
    },
  },

  Mutation: {
    editorsChoice: async (_, {input}, {dataSources}) => {
      const {
        clientMutationId,
        photoLegacyId,
      } = input;

      await dataSources.ContentStream.contentStream.editorsChoice(photoLegacyId);

      return {
        clientMutationId,
      };
    },

    uneditorsChoice: async (_, {input}, {dataSources}) => {
      const {
        clientMutationId,
        photoLegacyId,
      } = input;

      await dataSources.ContentStream.contentStream.uneditorsChoice(photoLegacyId);

      return {
        clientMutationId,
      };
    },

  },
};

const FEATURE_MAPPING_CONFIG = {
  'POPULAR_SECTION': {
    discoverSectionType: 'POPULAR_SECTION',
    personalizedCategories: false,
    excludeNude: true,
    excludePrivate: true,
  },
  'UPCOMING_SECTION': {
    discoverSectionType: 'UPCOMING_SECTION',
    personalizedCategories: false,
    excludeNude: true,
    excludePrivate: true,
  },
  'FRESH_SECTION': {
    discoverSectionType: 'FRESH_SECTION',
    personalizedCategories: false,
    excludeNude: true,
    excludePrivate: true,
  },
  'EDITORS_CHOICE_SECTION': {
    discoverSectionType: 'EDITORS_CHOICE_SECTION',
    personalizedCategories: false,
    excludeNude: true,
    excludePrivate: true,
  },
  'UNDISCOVERED': {
    discoverSectionType: 'POPULAR_SECTION',
    personalizedCategories: false,
    excludeNude: true,
    excludePrivate: true,
    followersCount: 'lte:200',
  },
};

/**
 * promiseGetCategoryCover.
 * @param {*} dataSources
 * @param {*} category
 * @return {Promise<Object>} A promise which will return an object of response from API corresponding
 */
async function promiseGetCategoryCoverPhoto(dataSources, category) {
  const {
    __ids,
  } = await dataSources.ContentStream.contentStream.photoDiscoverSearch(
      {pageNum: 1, pageSize: 10},
      {discoverSectionType: 'POPULAR_SECTION', personalizedCategories: false, categories: [category], excludeNude: true, excludePrivate: true},
  );

  return {'title': category.replace('&', 'and'), '__ids': __ids || []};
}


/**
 * promiseGetCategoryCover.
 * @param {*} dataSources
 * @param {*} feature
 * @param {*} featureConfig
 * @return {Promise<Object>} A promise which will return an object of response from API corresponding
 */
async function promiseFeaturesCoverPhoto(dataSources, feature, featureConfig) {
  const {
    __ids,
  } = await dataSources.ContentStream.contentStream.photoDiscoverSearch(
      {pageNum: 1, pageSize: 10},
      featureConfig,
  );

  return {'title': feature, '__ids': __ids || []};
}

/**
 * filterBlockedUser.
 * @param {*} dataSources
 * @param {*} photos
 * @return {Promise<Object>} photos
 */
async function filterBlockedUser(dataSources, photos) {
  const currentUserId = !!dataSources.UserCenter && dataSources.UserCenter.user.currentUserId;
  if (!currentUserId || !photos || photos.length == 0) {
    return photos;
  }

  const blockUserIds = await dataSources.SitewideSettings.sitewideSettingUserBlock.getUserBlockIdList(currentUserId);
  photos = photos.filter((_photo) => !!_photo && !blockUserIds.includes(_photo.__uploaderUserId));
  return photos;
}
