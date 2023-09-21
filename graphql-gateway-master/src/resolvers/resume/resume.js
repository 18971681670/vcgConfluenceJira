const anyRejected = (promises) => {
  return promises.some((promise) => promise.status === 'rejected');
};

const callWithRetry = async (func, times = 0, maxRetries = 1, timeout = 1000) => {
  try {
    return await func;
  } catch (error) {
    if (times>=maxRetries) {
      throw error;
    }
    await new Promise((resolve) => setTimeout(resolve, timeout));
    return callWithRetry(func, times+1);
  }
};

const delSpecialties = async (dataSources, specialtyNames) => {
  await callWithRetry(dataSources.Resume.specialties.del(specialtyNames));
};

const delResume = async (dataSources) => {
  const deleteResumeResponse = await dataSources.Resume.resume.del();
  if (deleteResumeResponse.status === 'rejected') throw new Error('Rollback deleting resume failed!');
  return deleteResumeResponse;
};

const delGallery = async (dataSources, galleryId) => {
  await callWithRetry(dataSources.Gallery.gallery.deleteSpecial(galleryId));
};

const rollback = async (dataSources, galleryIdsList) => {
  if (galleryIdsList.length !== 0) {
    const deleteGalleryRequests = galleryIdsList.map((galleryId) => {
      return delGallery(dataSources, galleryId);
    });

    const deleteGalleryResponses = await Promise.allSettled(deleteGalleryRequests);
    if (anyRejected(deleteGalleryResponses)) {
      throw new Error('Rollback deleting galleries failed!');
    }
  }
  await delResume(dataSources);
};

const createSpecialties = async (dataSources, specialtyGalleryObject) => {
  // Note specialtyGalleryObject uses uppercase specialty names as keys an the rest as values

  const createGalleriesRequests = Object.keys(specialtyGalleryObject).map((specialtyTitle) => {
    return dataSources.Gallery.gallery.createSpecialty(specialtyTitle);
  });

  const galleryIds = [];
  const createGalleriesResponses = await Promise.allSettled(createGalleriesRequests);
  createGalleriesResponses.forEach(({status, value}) => {
    if (status === 'fulfilled') {
      galleryIds.push(value.id);
      specialtyGalleryObject[value.name].galleryId = value.id;
    }
  });
  if (anyRejected(createGalleriesResponses)) {
    await rollback(dataSources, galleryIds);
    throw new Error('Something went wrong trying to create galleries');
  };

  const addPhotoToGalleryRequests = Object
      .values(specialtyGalleryObject)
      .filter((value) => value.photos && value.photos.length > 0)
      .map((value) => {
        if (value.photos.length > 8) throw new Error('Too many photos in speciality.');
        return dataSources.Gallery.photosOnGallery.add({
          galleryLegacyId: value.galleryId,
          photoLegacyIds: value.photos,
        });
      });

  const addPhotoToGalleryResponses = await Promise.allSettled(addPhotoToGalleryRequests); // eslint-disable-line
  if (anyRejected(addPhotoToGalleryResponses)) {
    rollback(dataSources, galleryIds);
    throw new Error('Something went wrong trying to add photos to galleries ');
  }

  const createSpecialtiesInput = Object.entries(specialtyGalleryObject).map(([key, value]) => {
    return {
      specialty: key.toLowerCase(),
      description: value.description,
      galleryId: value.galleryId,
    };
  });

  const createSpecialtiesResponse = await Promise.allSettled([dataSources.Resume.specialties.create(createSpecialtiesInput)]);
  if (anyRejected(createSpecialtiesResponse)) {
    rollback(dataSources, galleryIds);
    throw new Error('Something went wrong trying create specialties');
  }
};

export const resolvers = {
  Resume: {
    specialties: async ({__internalId}, _, {dataSources}) => {
      // Note: Will return stale specialties sometimes
      const specialties = await dataSources.Resume.specialties.findByResumeId(__internalId.toString());

      const specialtiesList = specialties.map((specialty) => {
        return {
          title: specialty.specialty.toUpperCase(),
          description: specialty.description,
          _photoIds: [],
          _galleryId: specialty.gallery_id,
        };
      });

      const photoIdsRequests = specialtiesList.map((specialtyObj) => {
        return dataSources.Gallery.photosOnGallery.legacyPaginatedPhotoIdList({pageSize: 8, pageNum: 1}, specialtyObj._galleryId);
      });

      const photoIdsResponses = await Promise.allSettled(photoIdsRequests);
      if (anyRejected(photoIdsResponses)) throw new Error('Something went wrong trying to get photos');

      photoIdsResponses.forEach((response, index) => {
        specialtiesList[index]._photoIds = response.value.__photoIds;
      });

      const totalPhotoIds = specialtiesList.reduce((acc, cur) => {
        return [...acc, ...cur._photoIds];
      }, []);

      const photoResponses = await dataSources.Photo.photo.findByInternalIds(totalPhotoIds);

      const photoToLegacyIdMap = photoResponses.reduce((acc, cur) => {
        if (cur) {
          const key = cur.legacyId.toString();
          return {...acc, [key]: cur};
        }
        return acc;
      }, {});

      return specialtiesList.map((specialty) => {
        return {
          ...specialty,
          photos: specialty._photoIds.map((photoId) => {
            return photoToLegacyIdMap[photoId];
          }),
        };
      });
    },
  },

  Mutation: {
    /*
     * Create resume object
     * Create galleries
     * Add photos to galleries
     * Connect resume specialties with photos
     */
    createResume: async (_, {input}, {dataSources, currentUserId}) => {
      if (!input.specialties || input.specialties.length < 1) {
        throw new Error('Need at least 1 specialty');
      }

      const specialtyGalleryObject = {};
      input.specialties.forEach((specialty) => {
        specialtyGalleryObject[specialty.title] = {
          description: specialty.description || '',
          photos: specialty.photos,
          galleryId: null,
        };
      });

      const [resume] = await Promise.allSettled([
        dataSources.Resume.resume.create(input),
      ]);
      if (anyRejected([resume])) throw new Error('Something went wrong trying to create resume');

      // Specialties will be resolved by specialties resolver
      await createSpecialties(dataSources, specialtyGalleryObject);

      let hireLocations = [];
      if (input.hireLocations) {
        ({hireLocations} = await dataSources.HireLocation.hireLocation.update(currentUserId, input.hireLocations));
      }

      return {
        resume: {
          ...resume.value,
        },
        hireLocations,
      };
    },

    updateResume: async (_, {input}, {dataSources, currentUserId}) => {
      const {
        about,
        yearsExperience,
        testimonials,
        deleteSpecialties,
        addSpecialties,
        updateSpecialties,
      } = input;

      // Update resume itself
      const updateResumeResponse = await dataSources.Resume.resume.update({about, yearsExperience, testimonials});
      const resumeId = updateResumeResponse.legacyId;

      /*
       * Delete galleries
       * Delete specialties
       */
      if (deleteSpecialties && deleteSpecialties.length > 0) {
        const specialties = await dataSources.Resume.specialties.findByResumeId(resumeId);

        const specialtiesToDelete = specialties.filter((specialty) => {
          return deleteSpecialties.includes(specialty.specialty.toUpperCase());
        });

        const galleryIds = specialtiesToDelete.map((specialty) => specialty.gallery_id);

        // Deleting galleries
        if (galleryIds.length > 0) {
          const deleteGalleryRequests = galleryIds.map((galleryId) => {
            return dataSources.Gallery.gallery.deleteSpecial(galleryId);
          });

          const deleteGalleryResponses = await Promise.allSettled(deleteGalleryRequests);
          if (anyRejected(deleteGalleryResponses)) throw new Error('Deleting galleries failed!');

          const specialtiesNames = specialtiesToDelete.map((specialty) => specialty.specialty.toUpperCase());

          // Deleting specialties
          try {
            await dataSources.Resume.specialties.del(specialtiesNames);
          } catch (error) {
            throw new Error('Deleting specialties failed!');
          }
        }
      }

      if (addSpecialties && addSpecialties.length > 0) {
        const specialtyGalleryObject = {};
        addSpecialties.forEach((specialty) => {
          specialtyGalleryObject[specialty.title] = {
            description: specialty.description || '',
            photos: specialty.photos,
            galleryId: null,
          };
        });

        await createSpecialties(dataSources, specialtyGalleryObject);
      }

      if (updateSpecialties && updateSpecialties.length > 0) {
        // Note: have to do this because the update endpoint doesn't return gallery ids
        const specialties = await dataSources.Resume.specialties.findByResumeId(resumeId);
        const updateSpecialtiesObject = updateSpecialties.map((updateSpecialty) => {
          const specialty = specialties.find((specialty) => specialty.specialty === updateSpecialty.title.toLowerCase());
          return {
            specialty: updateSpecialty.title.toLowerCase(),
            description: updateSpecialty.description,
            galleryId: specialty.gallery_id,
            addPhotos: updateSpecialty.addPhotos,
            deletePhotos: updateSpecialty.deletePhotos,
          };
        });

        const updateSpecialtiesRequest = updateSpecialties.map((specialty) => {
          return {
            specialty: specialty.title.toLowerCase(),
            description: specialty.description,
          };
        });

        // Note: once this returns gallery_ids, we can use it to populate the next step
        await dataSources.Resume.specialties.update(updateSpecialtiesRequest);

        // Note: no bulk delete on photos!
        const deletePhotoRequests = [];
        updateSpecialtiesObject.filter((specialty) => {
          return (specialty.deletePhotos && specialty.deletePhotos.length > 0);
        }).forEach((specialty) => {
          specialty.deletePhotos.forEach((photoId) => {
            deletePhotoRequests.push(
                dataSources.Gallery.photosOnGallery.remove({
                  galleryLegacyId: specialty.galleryId,
                  photoLegacyId: photoId,
                }),
            );
          });
        });

        const deletePhotosResponses = await Promise.allSettled(deletePhotoRequests);
        if (anyRejected(deletePhotosResponses)) throw new Error('Something went wrong trying to remove photos');

        const addPhotosRequests = updateSpecialtiesObject.filter((specialty) => {
          return (specialty.addPhotos && specialty.addPhotos.length > 0);
        }).map((specialty) => {
          return dataSources.Gallery.photosOnGallery.add({
            galleryLegacyId: specialty.galleryId,
            photoLegacyIds: specialty.addPhotos,
          });
        });

        const addPhotosResponses = await Promise.allSettled(addPhotosRequests);
        if (anyRejected(addPhotosResponses)) throw new Error('Something went wrong trying to add photos');
      }

      let hireLocations = [];
      if (input.hireLocations) {
        ({hireLocations} = await dataSources.HireLocation.hireLocation.update(currentUserId, input.hireLocations));
      }
      /*
       * update resume
       * delete specialties
       * add specialties
       * update specialties
       *
       * Specialties resolver
       */
      return {
        resume: {
          ...updateResumeResponse,
        },
        hireLocations,
      };
    },

    deleteResume: async (_, {legacyId}, {dataSources}) => {
      const galleryIds = await dataSources.Resume.resume.getGalleryIds(legacyId);
      // Note: Sometimes galleryIds is an array of null [null]. Why?
      const filteredGalleryIds = galleryIds.filter((galleryId) => !!galleryId);

      // Deleting galleries
      if (filteredGalleryIds.length > 0) {
        const deleteGalleryRequests = filteredGalleryIds.map((galleryId) => {
          return callWithRetry(delGallery(dataSources, galleryId));
        });

        if (deleteGalleryRequests.length > 0) {
          const deleteGalleryResponses = await Promise.allSettled(deleteGalleryRequests);
          if (anyRejected(deleteGalleryResponses)) throw new Error('Deleting galleries failed!');
        }
      }

      // Deleting specialties
      try {
        await delSpecialties(dataSources, []);
      } catch (error) {
        throw new Error('Deleting specialties failed!');
      }

      // Deleting resume
      const deleteResumeResponse = await delResume(dataSources);
      return {
        id: deleteResumeResponse.id,
      };
    },
  },
};
