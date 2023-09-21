import {CATEGORY_MAPPING} from '../../data_sources/photo/photo';
import {GEAR_TYPE} from '../../data_sources/gear';

const mapResolveTypeToGearType = {
  Camera: GEAR_TYPE.CAMERA,
  Lens: GEAR_TYPE.LENS,
};

export const dateHistogram = async ({__internalId, __resolveType}, _, {dataSources}) => {
  const gearType = mapResolveTypeToGearType[__resolveType];
  if (!gearType) return [];
  return await dataSources.Search.gearStatsAggregation.dateHistogram(gearType, __internalId);
};

export const best100Photos = async ({__internalId, __resolveType}, _, {dataSources}) => {
  const gearType = mapResolveTypeToGearType[__resolveType];
  if (!gearType) return [];
  const bestPhotoIds = await dataSources.Search.gearStatsAggregation.best100PhotoIds(gearType, __internalId);
  return bestPhotoIds && bestPhotoIds.length > 0 ? dataSources.Photo.photo.findByInternalIds(bestPhotoIds) : [];
};

export const topPhotographers = async ({__internalId, __resolveType}, _, {dataSources}) => {
  const gearType = mapResolveTypeToGearType[__resolveType];
  if (!gearType) return [];

  const topPhotographerIds = await dataSources.Search.gearStatsAggregation.topPhotographers(gearType, __internalId);
  const topPhotos = topPhotographerIds && topPhotographerIds.length > 0 ? await dataSources.Photo.photo.findByInternalIds(topPhotographerIds) : [];
  return topPhotos.map((photo) => ({photo: photo}));
};

export const topCategories = async ({__internalId, __resolveType}, _, {dataSources}) => {
  const gearType = mapResolveTypeToGearType[__resolveType];
  if (!gearType) return [];

  const categories = await dataSources.Search.gearStatsAggregation.topCategories(gearType, __internalId);
  const categoriesWithPhotoIds = (await Promise.allSettled(categories.map(async (c) => {
    const pIds = await dataSources.Search.gearStatsAggregation.topPhotographers(gearType, __internalId, c.category);
    return {
      category: CATEGORY_MAPPING[c.category] || CATEGORY_MAPPING[0],
      usersCount: c.users_count,
      photosCount: c.photos_count,
      photos: pIds,
    };
  }))).map((d) => d.value);
  const photoIds = [...new Set([].concat(...categoriesWithPhotoIds.map((c) => c.photos)))];
  const photos = photoIds && photoIds.length > 0 ? await dataSources.Photo.photo.findByInternalIds(photoIds) : [];
  const photoMap = new Map(photos.map((p) => [p.legacyId, p]));
  return categoriesWithPhotoIds.map((c) => {
    c.photos = c.photos.map((p) => photoMap.get(p)).filter((p) => !!p);
    return c;
  });
};
