import {getTabVisibility, getNewTab} from '../user';

describe('resolvers', () => {
  it('correctly calculates own tab visibility when viewing own profile', async () => {
    const visibility1 = getTabVisibility(true, 0, false);
    expect(visibility1).toEqual(false);
  });

  it('correctly calculates public tab visibility when count is 0', async () => {
    const visibility2 = getTabVisibility(false, 0, true);
    expect(visibility2).toEqual(false);
  });

  it('correctly calculates public tab visibility when count > 0', async () => {
    const visibility3 = getTabVisibility(false, 1, true);
    expect(visibility3).toEqual(true);
  });

  it('correctly creates new photo tab', async () => {
    const currentTab = {name: 'PHOTOS', visible: true};
    const newTab = getNewTab(currentTab, false, 3, 0, 0, 0);
    expect(newTab).toEqual({
      name: 'PHOTOS',
      visible: true,
      count: 3,
    });
  });

  it('correctly creates new galleries tab', async () => {
    const currentTab = {name: 'GALLERIES', visible: true};
    const newTab = getNewTab(currentTab, false, 0, 4, 0, 0);
    expect(newTab).toEqual({
      name: 'GALLERIES',
      visible: true,
      count: 4,
    });
  });

  it('correctly creates new licensing tab', async () => {
    const currentTab = {name: 'LICENSING', visible: true};
    const newTab = getNewTab(currentTab, false, 0, 0, 5, 0);
    expect(newTab).toEqual({
      name: 'LICENSING',
      visible: true,
      count: 5,
    });
  });

  it('correctly creates new resources tab', async () => {
    const currentTab = {name: 'RESOURCES', visible: true};
    const newTab = getNewTab(currentTab, false, 0, 0, 0, {totalCount: 6});
    expect(newTab).toEqual({
      name: 'RESOURCES',
      visible: true,
      count: 6,
    });
  });

  it('correctly creates new resume tab', async () => {
    const currentTab = {name: 'RESUME', visible: true};
    const newTab = getNewTab(currentTab, false, 1, 2, 3, 4);
    expect(newTab).toEqual({
      name: 'RESUME',
      visible: true,
      count: 0,
    });
  });
});
