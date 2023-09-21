import {resolvers} from '../gear';

describe('resolvers', () => {
  let dataSources;

  beforeEach(() => {
    dataSources = {
      Gear: {
        camera: {
          findByInternalId: jest.fn(),
        },
        lens: {
          findByInternalId: jest.fn(),
        },
      },
    };
  });

  it('getGear should return camera when GearType is camera', async () => {
    const exp = {id: 'camera'};
    dataSources.Gear.camera.findByInternalId.mockResolvedValueOnce(exp);
    const result = await resolvers.Query.getGear(null, {
      type: 'CAMERA',
      legacyId: exp.id,
    }, {dataSources});
    expect(result).toEqual(exp);
    expect(dataSources.Gear.camera.findByInternalId).toHaveBeenCalledTimes(1);
    expect(dataSources.Gear.camera.findByInternalId).toHaveBeenCalledWith(exp.id);
    expect(dataSources.Gear.lens.findByInternalId).toHaveBeenCalledTimes(0);
  });

  it('getGear should return lens when GearType is lens', async () => {
    const exp = {id: 'lens'};
    dataSources.Gear.lens.findByInternalId.mockResolvedValueOnce(exp);
    const result = await resolvers.Query.getGear(null, {
      type: 'LENS',
      legacyId: exp.id,
    }, {dataSources});
    expect(result).toEqual(exp);
    expect(dataSources.Gear.camera.findByInternalId).toHaveBeenCalledTimes(0);
    expect(dataSources.Gear.lens.findByInternalId).toHaveBeenCalledTimes(1);
    expect(dataSources.Gear.lens.findByInternalId).toHaveBeenCalledWith(exp.id);
  });

  it('getGear should return null when GearType is not camera and lens', async () => {
    const result = await resolvers.Query.getGear(null, {
      type: 'OTHERS',
      legacyId: 'id',
    }, {dataSources});
    expect(result).toBeNull();
    expect(dataSources.Gear.camera.findByInternalId).toHaveBeenCalledTimes(0);
    expect(dataSources.Gear.lens.findByInternalId).toHaveBeenCalledTimes(0);
  });
});
