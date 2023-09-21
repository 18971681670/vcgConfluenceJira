import {GEAR_TYPE} from '../../data_sources/gear';

export const resolvers = {
  Query: {
    getGear: async (_, {type, model, brand, legacyId: legacyIdInput}, {dataSources}) => {
      let legacyId = legacyIdInput;
      if (!legacyIdInput) {
        try {
          switch (type) {
            case GEAR_TYPE.CAMERA:
              legacyId = await dataSources.Gear.camera.getCameraIdByModelAndBrand({model, brand});
              break;
            case GEAR_TYPE.LENS:
              legacyId = await dataSources.Gear.lens.getLensIdByModelAndBrand({model, brand});
              break;
          }
        } catch (e) {
          return null;
        }
      }
      if (!legacyId) {
        return null;
      }

      if (type === GEAR_TYPE.CAMERA) {
        return await dataSources.Gear.camera.findByInternalId(legacyId);
      } else if (type === GEAR_TYPE.LENS) {
        return await dataSources.Gear.lens.findByInternalId(legacyId);
      }
      return null;
    },
  },
};
