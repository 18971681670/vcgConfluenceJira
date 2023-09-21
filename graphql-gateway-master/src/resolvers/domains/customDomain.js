/* eslint-disable */
export const resolvers = {
  CustomDomain: {
    validationSet: async (domain, _, {dataSources}) => {
      return dataSources.Domain.customDomain.getValidationRecordsForDomain(domain.legacyId);
    },
  },

  Mutation: {
    createCustomDomain: async (_, {input}, {dataSources}) => {
      const {fqdn, portfolioId, validationToken} = input;
      return {
        customDomain: await dataSources.Domain.customDomain.createCustomDomain(fqdn, portfolioId, validationToken),
      }
    },
    createCustomDomainForHover: async (_, {input}, {dataSources}) => {
      const {fqdn, portfolioId, validationToken} = input;
      return {
        customDomain: await dataSources.Domain.customDomain.createCustomDomainForHover(fqdn, portfolioId, validationToken),
      }
    },
    submitDomainForVerification: async (_, {legacyId}, {dataSources}) => {
      return {
        customDomain: await dataSources.Domain.customDomain.submitDomainForVerification(legacyId),
      }
    },
    deleteCustomDomain: async (_, {legacyId}, {dataSources}) => {
      return {
        customDomain: await dataSources.Domain.customDomain.deleteCustomDomain(legacyId),
      }
    },
    createCustomDomainValidationToken: async (_, {portfolioId}, {dataSources}) => {
      return await dataSources.Domain.customDomain.createCustomDomainValidationToken(portfolioId);
    }
  },

  Query: {
    getCustomDomainByPortfolioId: async (_, {portfolioId}, {dataSources}) => {
      return await dataSources.Domain.customDomain.getByPortfolioId(portfolioId);
    },

    getCustomDomainByFQDN: async (_, {fqdn}, {dataSources}) => {
      return await dataSources.Domain.customDomain.getCustomDomainByFQDN(fqdn);
    },
  },
};
