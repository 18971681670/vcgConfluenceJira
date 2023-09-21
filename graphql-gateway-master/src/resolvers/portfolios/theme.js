export const resolvers = {
  Query: {
    listPortfolioThemes: async (_, {sizes}, {dataSources}) => {
      return await dataSources.Portfolio.theme.listThemes(sizes);
    },
  },
  Theme: {
    imageUrls: async (theme, {sizes}) => {
      return theme.imageUrls.filter((imageUrl) => sizes.includes(imageUrl.size));
    },
  },
};
