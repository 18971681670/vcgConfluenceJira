import {logger} from '../../utils/logger';
import {ValidationError} from 'apollo-server-core';
import {ApolloError} from 'apollo-server-express';
import {
  generateToOneAssocationFieldResolver, loadSqlBasedConnectionFields,
} from '../helpers';

/*
 * Logic:
 * 1. If user is viewing own profile, all tabs in tab structure return user-defined visibility
 * 2. a. If another user is viewing your profile, tabs with count = 0 are invisible
 * 2. b. If another user is viewing your profile and a tab has count > 0, then set visibility based on tab visibility
 */
export const getTabVisibility = (viewingSelf, count, currentVisibility) => {
  if (viewingSelf || count > 0) {
    return currentVisibility;
  } else {
    return false;
  }
};

export const getNewTab = (tab, viewingSelf, photos, galleries, licensing, resources, stories, isAdmin = false) => {
  const newTab = {};
  newTab.name = tab.name;

  switch (tab.name) {
    case 'PHOTOS':
      newTab.visible = getTabVisibility(viewingSelf, photos, tab.visible);
      newTab.count = photos || 0;
      break;
    case 'GALLERIES':
      newTab.visible = getTabVisibility(viewingSelf, galleries, tab.visible);
      newTab.count = galleries || 0;
      break;
    case 'LICENSING':
      newTab.visible = getTabVisibility(viewingSelf, licensing, tab.visible);
      newTab.count = licensing || 0;
      break;
    case 'RESOURCES':
      newTab.visible = getTabVisibility(viewingSelf, resources.totalCount, tab.visible);
      newTab.count = resources.totalCount || 0;
      break;
    case 'STORIES':
      newTab.visible = getTabVisibility(viewingSelf, stories, tab.visible);
      newTab.count = stories || 0;
      break;
    default:
      newTab.visible = tab.visible;
      newTab.count = 0;
      break;
  }

  /*
   * IF user set photo, licensing, gallery tab to private in profile settings, Admin should still see the tabs
   * If admin is viewing own profile, should return real visibility (won't affect the tab, but is related to Everyone/OnlyMe display)
   */
  if (isAdmin && !viewingSelf && (tab.name == 'PHOTOS' || tab.name == 'GALLERIES' || tab.name == 'LICENSING' || tab.name == 'STORIES')) {
    newTab.visible = true;
  }

  return newTab;
};

export const resolvers = {
  User: {
    // Deprecated. `canonicalPath should be in the format /p/<username>. /<username is the old Profile path and is no longer used.
    canonicalPath: ({username}) => {
      return `/${username}`;
    },

    canonicalPathV2: ({username}) => {
      // This resolver is used directly by src/resolvers/notification/hydration_helpers.js:hydrateLink datasources
      return `/p/${username}`;
    },

    displayName: async ({__internalId, username, firstName, lastName}, _, {dataSources}) => {
      let name = `${firstName || ''} ${lastName || ''}`.trim();

      if (__internalId != dataSources.UserCenter.user.currentUserId) {
        const userSetting = await dataSources.UserProfile.userSetting.loadData(__internalId);
        const firstnameVisible = userSetting.firstnameVisible;
        name = firstnameVisible ? name : null;
      }
      return name ? name : username;
    },

    displayLocation: async ({__internalId, city, country}, _, {dataSources}) => {
      let location;
      if (city && country) {
        location = `${city || ''},${country || ''}`.trim();
      } else {
        location = `${city || ''} ${country || ''}`.trim();
      }

      if (__internalId != dataSources.UserCenter.user.currentUserId) {
        const userSetting = await dataSources.UserProfile.userSetting.loadData(__internalId);
        const locationVisible = userSetting.locationVisible;
        location = locationVisible ? location : '';
      }
      return location;
    },

    avatar: async ({__internalId, __resource}, _, {dataSources}) => {
      __resource = __resource || await dataSources.UserCenter.user.findByInternalId(__internalId);
      const {__avatarS3Path, __avatarVersion} = __resource;
      return dataSources.Media.userAvatar.reducer({
        id: __internalId,
        __avatarS3Path,
        __avatarVersion,
      });
    },

    contact: async ({__internalId, __raw}, _, {dataSources}) => {
      // FIXME basic access control in GraphQL for now to prevent email leak
      if (__internalId != dataSources.UserCenter.user.currentUserId) {
        return null;
      }

      return {
        __internalId,
        __userRaw: __raw,
      };
    },

    membership: generateToOneAssocationFieldResolver('membership', 'Membership', 'Membership', '__internalId'),

    licensing: generateToOneAssocationFieldResolver('licensing', 'Licensing', 'LicensingContributor',
        '__internalId'),

    userProfile: async ({__internalId, __userProfileMutationError}, _, {dataSources}) => {
      if (__userProfileMutationError && __userProfileMutationError instanceof ApolloError) throw __userProfileMutationError;

      return await dataSources.UserProfile.personalAndProfile.loadData(__internalId);
    },

    // has deprecated, please use SocialMediaItems
    socialMedia: async ({__internalId}, _, {dataSources}) => {
      return await dataSources.UserProfile.socialMedia.loadData(__internalId);
    },

    socialMediaItems: async ({__internalId}, {providers}, {dataSources}) => {
      return await dataSources.UserProfile.socialMediaItem.loadItemByProvider(__internalId, providers ? providers : ['twitter', 'instagram', 'facebookpage', 'website', 'portfolioSite']);
    },

    profileTabs: async ({__internalId, __profileTabs}, _, {dataSources, currentUserId}) => {
      // __profileTabs is present when profile tabs are changed in the updateUser mutation
      let response = __profileTabs || await dataSources.UserProfile.profileTabs.getTabs(__internalId);
      const viewingSelf = currentUserId == __internalId;

      let isAdmin = false;
      if (currentUserId != null) {
        const currentUser = await dataSources.UserCenter.user.findByInternalId(currentUserId);
        if (currentUser != null && currentUser.type == 'ADMIN') {
          isAdmin = true;
        }
      }

      /*
       * Note: if the MS response is an empty string or a comma-separated list
       * the tabs reducer will throw a SyntaxError and response will be undefined
       */
      if (!response) {
        response = await dataSources.UserProfile.profileTabs.getDefaultTabs(__internalId);
      }

      const [photos, galleries, licensing, resources, stories] = await Promise.all([
        // Profile photo count
        dataSources.Photo.myPhotos.countForProfile(__internalId, isAdmin),
        // Single gallery + totalcount
        dataSources.Gallery.gallery.countForProfile(__internalId, isAdmin),
        // Single licensing photo + totalcount
        dataSources.Licensing.myLicensingPhotos.countForProfile(__internalId, isAdmin),
        // Resource pageInfo
        dataSources.Resource.resource.getUserIdPageInfo(__internalId, null, 1, !viewingSelf),
        // Profile story count
        dataSources.Story.story.countForProfile(__internalId, isAdmin),
      ]);

      const tabs = response.tabs.map((tab) => {
        return getNewTab(tab, viewingSelf, photos, galleries, licensing, resources, stories, isAdmin);
      });
      // Remove stories tab
      tabs.map((item, index) => {
        if (item.name === 'STORIES') {
          tabs.splice(index, 1);
        }
      });
      return {tabs};
    },

    equipment: async ({__internalId}, _, {dataSources}) => {
      return await dataSources.UserProfile.userEquipment.loadData(__internalId);
    },

    userSetting: async ({__internalId}, _, {dataSources}) => {
      return await dataSources.UserProfile.userSetting.loadData(__internalId);
    },

    settings: async ({__internalId}, _, {dataSources}) => {
      try {
        const settings = await dataSources.SitewideSettings.userSettings.getSettings(__internalId);
        return {
          ...settings,
          onboarding_categories: async () => {
            return settings.onboarding_categories ? settings.onboarding_categories.split(',') : [];
          },
        };
      } catch (error) {
        if (error.extensions.response.status === 403) return null;
        throw error;
      }
    },

    extended: async ({__internalId}, _, {dataSources}) => {
      const __extendedUser = await dataSources.UserCenter.extendedUser.findByInternalId(__internalId);
      const extended = __extendedUser && __extendedUser.__raw &&
          dataSources.UserCenter.extendedUser.reducer(__extendedUser.__raw);
      return extended;
    },

    gdprAcceptanceTimestamp: async ({__internalId}, _, {dataSources}) => {
      const __tosAcceptance = await dataSources.UserProfile.tosAcceptance.loadData(__internalId);
      return __tosAcceptance.signingTimestamp == undefined ? null : __tosAcceptance.signingTimestamp;
    },

    coverPhotoUrl: async ({__internalId}, _, {dataSources}) => {
      const response = await dataSources.UserCenter.user.getUserCoverPhotoUrl(__internalId);
      return response.cover_photo_url;
    },

    licensingStats: async ({__internalId}, _, {dataSources}) => {
      return dataSources.Licensing.licensingPhotoStat.findByKey(__internalId);
    },

    licensingPhotos: async ({__internalId}, {status, first, after}, {dataSources}) => {
      const loadConnection = loadSqlBasedConnectionFields({first, after}, async (legacyPagination) => {
        const {
          totalCount,
          __photoIds,
        } = await dataSources.Licensing.myLicensingPhotos.paginatedLicensingPhotoListByUserId(
            __internalId,
            legacyPagination,
            status,
        );

        return {
          nodes: (await dataSources.Licensing.licensingPhoto.findByInternalIds(__photoIds)),
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
        __filter: status,
      };
    },

    photoStories: async ({__internalId}, {first, after}, {dataSources, currentUserId, currentUserType}) => {
      let privacy = 'PUBLIC';
      if (currentUserId == __internalId || currentUserType == '9' && currentUserId != null) {
        privacy = 'ALL';
      }
      const sort = 'CREATED_AT_DESC';
      const loadConnection = loadSqlBasedConnectionFields({first, after}, async (legacyPagination) => {
        const {
          __stories,
          totalCount,
        } = await dataSources.Story.story.pageStoryList(
            privacy, sort, __internalId, null, null, true, legacyPagination,
        );

        return {
          nodes: __stories,
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

    portfolio: async ({legacyId}, _, {dataSources}) => {
      return await dataSources.Portfolio.portfolio.findByInternalId(legacyId);
    },

    recentVotes: async (user, input, {dataSources, currentUserId}) => {
      if (!currentUserId || currentUserId.toString() !== user.legacyId.toString()) {
        return [];
      }

      const likeAction = 2;
      const photoObjectType = 1;
      const noneTargetType = 0;

      const activities = await dataSources.Homefeed.activityfeed.recentActions(
          user.legacyId, likeAction, photoObjectType, noneTargetType, input.first, '');

      return activities.map((activity) => activity.objectItemId);
    },

    resume: async ({legacyId}, _, {dataSources}) => {
      return dataSources.Resume.resume.findByInternalId(legacyId);
    },

    hireLocations: async ({legacyId}, _, {dataSources}) => {
      const {hireLocations} = await dataSources.HireLocation.hireLocation.getUserHireLocations(legacyId);
      return hireLocations;
    },

    quests: async ({__internalId}) => {
      return {_user_id: __internalId};
    },

    badges: async ({__internalId}, _, {dataSources}) => {
      const {badges} = await dataSources.UserProfile.userBadge.findByInternalId(__internalId);
      return badges;
    },

    hasUnreadNotifications: async ({__internalId}, _, {dataSources}) => {
      return dataSources.Notification.notification.hasUnreadNotifications(__internalId);
    },

    isBlockedByMe: async ({__internalId}, _, {dataSources}) => {
      return dataSources.SitewideSettings.userSettings.isBlockedByMe(__internalId);
    },
  },

  Mutation: {
    updateUser: async (_, {input}, {dataSources}) => {
      const {
        legacyId,
        userProfile,
        socialMedia,
        socialMediaItems,
        equipment,
        userSetting,
        contact,
        profileTabs,
        hireLocations,
      } = input;

      const user = await dataSources.UserCenter.user.update(input.legacyId, input);

      /*
       * NOTE: allSettled waits until all promises have either resolved or errored out
       * NOTE: User fields are hydrated by the User resolver
       * userProfile resolver also overrides any values you attach to user object
       * FIXME: userProfile resolver is behind the update and sometime returns stale values
       */
      const [
        /* eslint-disable no-unused-vars */
        {value: updatedUserProfile, reason: userProfileError},
        {value: updatedUserSetting},
        {value: updatedSocialMedia},
        {value: updateSocialMediaItems},
        {value: updatedEquipment},
        {value: updatedContact},
        {value: updatedProfileTabs},
        {value: updatedHireLocations},
        /* eslint-enable no-unused-vars */
      ] = await Promise.allSettled([
        userProfile ? dataSources.UserProfile.personalAndProfile.update({...userProfile, id: legacyId}) : null,
        userSetting ? dataSources.UserProfile.userSetting.update(legacyId, {...userSetting, id: legacyId}) : null,
        socialMedia ? dataSources.UserProfile.socialMedia.update({...socialMedia, id: legacyId}) : null,
        socialMediaItems ? dataSources.UserProfile.socialMediaItem.updateItems(socialMediaItems) : null,
        equipment ? dataSources.UserProfile.userEquipment.update({...equipment, id: legacyId}) : null,
        contact ? dataSources.UserCenter.userContact.update({
          'userId': legacyId,
          'verifiedPhoneNumber': contact.phone,
          'countryCode': contact.phoneCountry,
        }) : null,
        profileTabs ? dataSources.UserProfile.profileTabs.update(profileTabs) : null,
        hireLocations ? dataSources.HireLocation.hireLocation.update(legacyId, hireLocations) : null,
      ]);

      if (updatedProfileTabs) user.__profileTabs = updatedProfileTabs;
      if (userProfileError) {
        if (userProfile && userProfile.isDirectThrows) throw userProfileError;
        else user.__userProfileMutationError = userProfileError;
      }

      return {
        clientMutationId: input.clientMutationId,
        user,
      };
    },
    webUserRegister: async (_, {input}, {dataSources}) => {
      let {
        analyticsCode,
        captchaResponse,
        emailNotificationsEnabled,
        authToken,
        authMode,
      } = input;

      if (authMode) {
        authMode = authMode.toLowerCase();
      }
      const user = await dataSources.UserCenter.userCenter.userRegister({
        ...input,
        auth_mode: authMode,
        analytics_code: analyticsCode,
        captcha_response: captchaResponse,
        email_notifications_enabled: emailNotificationsEnabled,
        auth_token: authToken,
      });

      return {
        clientMutationId: input.clientMutationId,
        user,
      };
    },
    mobileUserRegister: async (_, {input}, {dataSources}) => {
      let {
        analyticsCode,
        captchaResponse,
        emailNotificationsEnabled,
        authToken,
        authMode,
        consumerKey,
      } = input;

      if (!consumerKey) {
        throw new ValidationError(`consumerKey in input is required`);
      }

      if (authMode) {
        authMode = authMode.toLowerCase();
      }

      const user = await dataSources.UserCenter.userCenter.userRegister({
        ...input,
        auth_mode: authMode,
        analytics_code: analyticsCode,
        captcha_response: captchaResponse,
        email_notifications_enabled: emailNotificationsEnabled,
        consumer_key: consumerKey,
        auth_token: authToken,
      });

      // enable featuredPhotographer
      await dataSources.Homefeed.featuredPhotographer.enabledByUserId(user.legacyId);

      // mobile app do not need token.
      delete user.csrfToken;
      delete user.jwtToken;

      return {
        clientMutationId: input.clientMutationId,
        user,
      };
    },
  },
};
