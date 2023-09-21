const activatePortfolio = async (_, {portfolioId}, {dataSources}) => {
  return dataSources.Portfolio.portfolio.activate(portfolioId);
};

const deactivatePortfolio = async (_, input, {dataSources}) => {
  return dataSources.Portfolio.portfolio.deactivate(input.portfolioId, {
    deactivatedMessage: input.deactivatedMessage,
  });
};

const resolveLegalSettings = (type, customUrl) => {
  if (type === 'CUSTOM') {
    return {
      __resolveType: 'PortfolioCustomLegalSettings',
      url: customUrl,
    };
  }

  return {
    __resolveType: 'PortfolioBasicLegalSettings',
    type,
  };
};

const reservedHostname = process.env.PORTFOLIO_RESERVED_DOMAIN || 'j79-dev.500pix.com';

export const resolvers = {
  Portfolio: {
    theme: async (portfolio, _, {dataSources}) => {
      return await dataSources.Portfolio.theme.findByInternalId(portfolio.__themeName);
    },

    user: async (portfolio, _, {dataSources}) => {
      return await dataSources.UserCenter.user.findByInternalId(portfolio.__userId);
    },

    folders: async (portfolio, _, {dataSources}) => {
      return await dataSources.Portfolio.folder.findByInternalIds(portfolio.__folderIds);
    },

    customDomain: async (portfolio, _, {dataSources}) => {
      return await dataSources.Domain.customDomain.getByPortfolioId(portfolio.legacyId);
    },

    coverPhoto: (portfolio) => {
      return {
        __coverResolveType: portfolio.__coverVersion ? 'PortfolioCoverImage' : 'PortfolioCoverAvatar',
        __coverPhotoId: portfolio.__coverPhotoId,
        __userId: portfolio.__userId,
      };
    },

    coverImages(portfolio, {sizes}, {dataSources}) {
      return dataSources.Resize.portfolioCoverResizeImage.findByInternalId({
        id: portfolio.legacyId,
        sizes,
      });
    },

    termsOfUse: (portfolio) => {
      return resolveLegalSettings(portfolio.__termsOfUseType, portfolio.__termsOfUseUrl);
    },

    privacyPolicy: (portfolio) => {
      return resolveLegalSettings(portfolio.__privacyPolicyType, portfolio.__privacyPolicyUrl);
    },

    userDisabled: (portfolio) => {
      return portfolio.__userLostPermission || portfolio.__userBanned;
    },
  },

  PortfolioCover: {
    __resolveType: (cover) => {
      return cover.__coverResolveType;
    },
  },

  PortfolioCoverImage: {
    images: async (cover, {sizes}, {dataSources}) => {
      return dataSources.Resize.portfolioCoverResizeImage.findByInternalId({
        id: cover.__userId,
        sizes,
      });
    },
  },

  PortfolioCoverPhoto: {
    photo: async (cover, _, {dataSources}) => {
      return await dataSources.Photo.photo.findByInternalId(cover.__coverPhotoId);
    },
  },

  PortfolioCoverAvatar: {
    avatar: async (cover, _, {dataSources}) => {
      const user = await dataSources.UserCenter.user.findByInternalId(cover.__userId);
      return dataSources.Media.userAvatar.reducer({
        id: cover.__userId,
        __avatarS3Path: user.__avatarS3Path,
        __avatarVersion: user.__avatarVersion,
      });
    },
  },

  PortfolioLegalSettings: {
    __resolveType: (settings) => {
      return settings.__resolveType;
    },
  },

  Mutation: {
    uploadPresignedPortfolioCover: async (_, {}, {dataSources}) => {
      const {
        directUpload,
        objectName,
      } = await dataSources.Portfolio.portfolio.uploadPresignedPortfolioCover();

      return {
        directUpload,
        objectName,
      };
    },
    createPortfolio: async (_, {userId, title, description, themeName, email}, {dataSources}) => {
      const createBody = {
        title: title,
        description: description,
        themeName: themeName,
        email: email,
      };

      if (email===null || email===undefined) {
        const profile = await dataSources.UserProfile.personalAndProfile.loadData(userId);
        createBody['email'] = profile.email;
      }

      const response = await dataSources.Portfolio.portfolio.create(userId, createBody);
      return {
        portfolio: response,
      };
    },

    deletePortfolio: async (_, {portfolioId}, {dataSources}) => {
      const response = await dataSources.Portfolio.portfolio.del(portfolioId);
      return {
        portfolio: response,
      };
    },

    updatePortfolio: async (_, {portfolioId, input}, {dataSources}) => {
      const upsertBody = {
        title: input.title,
        description: input.description,
        deactivatedMessage: input.deactivatedMessage,
        coverPhotoId: input.coverPhotoId,
        coverUserId: input.coverUserId,
        coverObjectName: input.coverObjectName,
        themeName: input.themeName,
        font: input.font,
        colour: input.colour,
        appearance: input.appearance,
        termsOfUseType: input.termsOfUseType,
        termsOfUseUrl: input.termsOfUseUrl,
        privacyPolicyType: input.privacyPolicyType,
        privacyPolicyUrl: input.privacyPolicyUrl,
        visibilityOptions: input.visibilityOptions,
        analyticsCode: input.analyticsCode,
        location: input.location,
        socialMedia: input.socialMedia,
        email: input.email,
      };
      return await dataSources.Portfolio.portfolio.update(portfolioId, upsertBody);
    },

    saveAndPublishPortfolio: activatePortfolio,

    saveAndExitPortfolio: deactivatePortfolio,

    activatePortfolio: activatePortfolio,

    deactivatePortfolio: deactivatePortfolio,

    reorderFoldersInPortfolio: async (_, {portfolioId, folderId, afterId=null}, {dataSources}) => {
      return await dataSources.Portfolio.portfolio.reorderFoldersInPortfolio(portfolioId, folderId, afterId);
    },
  },

  Query: {
    getPortfolioById: async (_, {portfolioId}, {dataSources}) => {
      return await dataSources.Portfolio.portfolio.findByInternalId(portfolioId);
    },

    getPortfolioByUserId: async (_, {userId}, {dataSources}) => {
      return await dataSources.Portfolio.portfolio.findByInternalId(userId);
    },

    getPortfolioByDomain: async (_, {domain}, {dataSources}) => {
      if (domain.endsWith('.' + reservedHostname)) {
        const username = domain.split('.')[0];
        const user = await dataSources.UserCenter.user.findByUsername(username);
        return await dataSources.Portfolio.portfolio.findByInternalId(user.legacyId);
      }

      let customDomain;
      if (domain.startsWith('www.')) {
        customDomain = await dataSources.Domain.customDomain.getCustomDomainByFQDN(domain.replace('www.', ''))
            .catch(() => dataSources.Domain.customDomain.getCustomDomainByFQDN(domain));
      } else {
        customDomain = await dataSources.Domain.customDomain.getCustomDomainByFQDN(domain);
      }

      return await dataSources.Portfolio.portfolio.findByInternalId(customDomain.resourceId);
    },
  },
};
