import {ProfileTabs} from '../src/data_sources/user_profile/profile_tabs';

/**
 * Pass list of user ids to update tab visibility
 */
const updateResumeTabVisibility = async (ids) => {
  for (const id of ids) {
    const profileTabs = new ProfileTabs();
    profileTabs.initialize({
      context: {
        requestHeaders: {'x-500px-user-id': id},
        currentUserId: id,
      }
    });
    const currentTabs = await profileTabs.getTabs(id);
    if (currentTabs && currentTabs.tabs) {
      const resumeTab = currentTabs.tabs.find(currentTab => currentTab.name === 'RESUME');
      console.log('currentTab', resumeTab);
      if (resumeTab && !resumeTab.visible) {
        console.log(`updating existing resume tab for ${id}`);
        const result = await profileTabs.updateOneTab({ name: "resume", visible: true });
        console.log('result', result);
      }
    }
    if (!currentTabs || !currentTabs.tabs) {
      console.log(`no tabs, updating for ${id}`);
      try {
        const result = await profileTabs.updateOneTab({ name: "resume", visible: true });
        console.log('result', result);
      } catch (e) {
        console.log('error', e);
        throw new Exception(e);
      }
    }
    console.log(`skipping ${id}`);
  };
}

(async () => {
  // User ids go here
  updateResumeTabVisibility([]);
})();
