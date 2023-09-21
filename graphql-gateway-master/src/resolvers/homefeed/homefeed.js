import {logger} from '../../utils/logger';

export const resolvers = {
  HomefeedItem: {
    __resolveType({__resolveType}) {
      /*
       * Resolves the specific item type passed in
       * so __resolveType: 'Gallery' will call the Gallery resolver, etc
       */
      return __resolveType;
    },
  },
  Query: {
    myHomefeed: async (_, {first, after, excludeNude}, {dataSources, currentUserShowNude}) => {
      const {
        ordering,
        photoIds,
        galleryIds,
        total,
        pageInfo,
      } = await dataSources.Homefeed.homefeedItems.homefeedPaginated(first, after);

      const [photos, galleries] = await Promise.all([
        dataSources.Photo.photo.bulkLoadData(photoIds),
        dataSources.Gallery.gallery.bulkLoadData(galleryIds),
      ]);

      const excludeNsfw = excludeNude || !currentUserShowNude;

      photos.forEach((photo) => {
        const key = `photo-${photo.id}`;
        if (ordering[key]) {
          const reducedPhoto = dataSources.Photo.photo.reducer(photo);
          // Should be done in the microservice
          if (reducedPhoto.notSafeForWork && excludeNsfw) {
            delete ordering[key];
          } else {
            ordering[key]['node'] = reducedPhoto;
          }
        }
      });

      galleries.forEach((gallery) => {
        const key = `gallery-${gallery.id}`;
        if (ordering[key]) {
          ordering[key]['node'] = dataSources.Gallery.gallery.reducer(gallery);
        }
      });

      // chronological ordering should be preserved since ES6
      const edges = Object.values(ordering);

      return {
        edges,
        pageInfo: {
          startCursor: edges[0].cursor,
          endCursor: edges[edges.length - 1].cursor,
          hasNextPage: pageInfo.hasNextPage,
          hasPreviousPage: pageInfo.hasPreviousPage,
        },
        totalCount: total,
      };
    },
    myHomefeeds: async (_, {first, after, recommendations, excludeNude}, {dataSources, currentUserShowNude, requestHeaders}) => {
      // FIXME: remove this after making `sort` mandatory
      const hydratedevents = [];
      let nextPage = after;
      let requestTries = 0;
      const totalCursors = {};
      do {
        const {
          __events,
          next,
          cursors,
        } = await dataSources.Homefeed.homefeed.homefeedPaginated(
            first, nextPage,
        );
        Object.assign(totalCursors, cursors);

        const currentUserId = dataSources.UserCenter.user.currentUserId;
        const blockUserIds = await dataSources.SitewideSettings.sitewideSettingUserBlock.getUserBlockIdList(currentUserId);
        const forAndroid = requestHeaders['x-500px-client-application-id'] === '44129';
        for (let j = 0, len = __events.length; j < len; j++) {
          let objects = null;
          if (recommendations || __events[j].eventType != 'photo_recommendation') {
            if (__events[j].objectType == 'photo') {
              const photos = await dataSources.Photo.photo.bulkLoadData(__events[j].__objectIds.map(Number));
              if (!!photos) {
                objects = photos.map((obj) => {
                  if (null != obj) {
                    return dataSources.Photo.photo.reducer(obj);
                  } else {
                    return null;
                  }
                });
              }
            } else if (__events[j].objectType == 'gallery') {
              // logger.debug('====gallery_objectIds====', {galleryIds: __events[j].__objectIds});
              const gallerys = await dataSources.Gallery.gallery.bulkLoadData(__events[j].__objectIds.map(Number));
              // logger.debug('====gallerys====', {gallerys: gallerys});
              if (!!gallerys) {
                objects = gallerys.map((obj) => {
                  if (null != obj) {
                    return dataSources.Gallery.gallery.reducer(obj);
                  } else {
                    return null;
                  }
                });
              }
            }
            if (null != objects) {
              const res = [];
              /*
               * const res = objects.filter(function(val) {
               *   if (!!val) {
               *     if (val.objectType == 'photo') {
               *       if (!!val.height && !!val.width) {
               *         return true;
               *       } else {
               *         return false;
               *       }
               *     } else {
               *       return true;
               *     }
               *   } else {
               *     return false;
               *   }
               * });
               */
              /*
               * logger.debug('====currentUserShowNude====', {currentUserShowNude: currentUserShowNude});
               * logger.debug('====excludeNude====', {excludeNude: excludeNude});
               */
              for (let i = 0, len = objects.length; i < len; i++) {
                const val = objects[i];
                if (!!val) {
                  if (__events[j].objectType == 'photo') {
                    if ((!!val.height || val.height === 0) && (!!val.width || val.width === 0) && !blockUserIds.includes(val.__uploaderUserId)) {
                      // for SQP-6975; Compatible with Android；Will add retry in backend and Android should set default values
                      if (forAndroid) {
                        val.height = val.height || 1000;
                        val.width = val.width || 1000;
                      }
                      // logger.debug('====val====', {val: val});
                      if (val.privacy != 'LIMITED_ACCESS') {
                        if (val.notSafeForWork) {
                          if (!excludeNude) {
                            // setting 设置可以看nsfw图片
                            if (currentUserShowNude) {
                              res.push(val);
                            } else {
                              // setting 设置不可以看nsfw图片，但是图片是自已的，前端需添加黑色封面
                              if (val.__uploaderUserId == currentUserId) {
                                res.push(val);
                              }
                            }
                          }
                        } else {
                          res.push(val);
                        }
                      }
                    }
                  } else if (__events[j].objectType == 'gallery' && !blockUserIds.includes(__events[j].__raw.from_user_id * 1)) {
                    const {
                      photoIds,
                    } = await dataSources.Gallery.photosOnGallery.cursorPaginatedPhotoIdList({size: 20, legacyId: val.legacyId});
                    if (!!photoIds) {
                      const nodes = await dataSources.Photo.photo.findByInternalIds(photoIds);
                      const hasPhotos = nodes.some(function(photo) {
                        if (!!photo) {
                          // nsfw 图片
                          if (photo.notSafeForWork) {
                            if (excludeNude) {
                              return false;
                            }
                            // setting 设置不可以看nsfw图片
                            if (!currentUserShowNude) {
                              // 图片也不是当前用户的
                              if (photo.__uploaderUserId != currentUserId) {
                                return false;
                              }
                            }
                          }
                          if ((!!photo.height || photo.height === 0) && (!!photo.width || photo.width === 0) && !blockUserIds.includes(photo.__uploaderUserId)) {
                            if (forAndroid) {
                              photo.height = photo.height || 1000;
                              photo.width = photo.width || 1000;
                            }
                            return true;
                          } else {
                            return false;
                          }
                        }
                        return false;
                      });
                      if (hasPhotos) {
                        res.push(val);
                      }
                    }
                  }
                }
              }
              if (res.length > 0) {
                __events[j].objects = res;
                hydratedevents.push(__events[j]);
              }
            }
          }
        }
        requestTries += 1;
        nextPage = next;
      } while (hydratedevents.length < 2 && requestTries < 5 && !!nextPage);

      // TODO: will be refactored/removed as part of tracking service redesign
      await dataSources.Photo.photoViewCount.incrementViewCount(hydratedevents
          .filter((event) => event.__objectType === 'photo')
          .map((event) => event.__objectIds && event.__objectIds[0]));

      return {
        edges: hydratedevents.map((node) => {
          /*
           * logger.debug('====node====', {node: node});
           */
          return {
            node: node,
            cursor: totalCursors[node.eventId],
          };
        }),
        pageInfo: {
          // startCursor: nextPage,
          endCursor: nextPage,
          hasNextPage: !!nextPage,
        },
        totalCount: hydratedevents.length,
      };
    },
  },
};
