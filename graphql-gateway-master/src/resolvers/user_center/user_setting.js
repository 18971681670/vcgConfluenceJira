import {atob} from '../../utils/base64';

const getUserId = async (dataSources, currentUserId, token) => {
  if (token) {
    const decodedToken = atob(token);
    const DELIMITER = '::';
    const [userIdFromToken, emailFromToken] = decodedToken && decodedToken.split(DELIMITER);
    // if userId exists, but if it's not a number, or we don't have an email, the decoded token is malformed
    if (userIdFromToken && (isNaN(Number(userIdFromToken)) || !emailFromToken)) return null;
    const {__raw} = await dataSources.UserCenter.user.findByInternalId(userIdFromToken);
    const {email} = __raw && dataSources.UserCenter.userContact.reducerFromUser(__raw);
    // if email from token matches email of user in token, continue..
    if (email && email === emailFromToken) return userIdFromToken;
    return null;
  } else {
    return currentUserId;
  }
};

const handleUpdateUserSubscriptions = async (input, dataSources, currentUserId) => {
  const {channels, token} = input;

  const userId = await getUserId(dataSources, currentUserId, token);

  if (!userId) return null;
  // FIXME: Under the hood this is a PUT, but we're going to treat it as a PATCH
  const currentChannels = await dataSources.Subscriptions.subscriptionChannels.getSubscriptionChannels(userId);

  const channelsObject = {};
  currentChannels.forEach((currentChannel) => {
    const {name, pushEnabled, emailEnabled} = currentChannel;
    channelsObject[name] = {
      pushEnabled,
      emailEnabled,
    };
  });

  channels.forEach((updateChannel) => {
    const {name, pushEnabled, emailEnabled} = updateChannel;
    // Update push or email enabled if it exists in the request
    if (channelsObject[name]) {
      if (pushEnabled !== null && pushEnabled !== undefined) {
        channelsObject[name].pushEnabled = pushEnabled;
      }
      if (emailEnabled !== null && emailEnabled !== undefined) {
        channelsObject[name].emailEnabled = emailEnabled;
      }
    }

    /*
     * 需要拆分的条目对象数组
     * nameCombine表示合并 后 条目名称
     * nameExtent表示合并 前 条目名称列表
     */
    const specialArr = [
      {
        nameCombine: 'COMMENTS',
        nameExtent: ['COMMENT', 'COMMENT_MENTION'],
      },
      {
        nameCombine: 'YOUR_PHOTO',
        nameExtent: ['UPCOMING', 'POPULAR', 'EDITORS_CHOICE'],
      },
    ];

    specialArr.forEach((special)=>{
      /*
       * 修改时传入对象的name比对合并后条目名称
       * 如果true表示需要把合并前条目的pushEnabled更换为页面传入对象里面pushEnabled的值
       */
      if (special.nameCombine === name) {
        special.nameExtent.forEach((extent) => {
          if (channelsObject[extent]) {
            channelsObject[extent].pushEnabled = pushEnabled;
          }
        });
      }
    });
  });

  const responseChannels = await dataSources.Subscriptions.subscriptionChannels.updateSubscriptionChannels(userId, channelsObject);
  return queryChannelHandle(responseChannels);
};

const handleUpdateAllUserSubscriptions = async (input, dataSources, currentUserId) => {
  const {email, push, token} = input;
  const userId = await getUserId(dataSources, currentUserId, token);
  if (!userId) return null;

  const currentChannels = await dataSources.Subscriptions.subscriptionChannels.getSubscriptionChannels(userId);

  const allEmail = (email !== undefined && email !== null) ? email : null;
  const allPush = (push !== undefined && push !== null) ? push : null;

  if (allEmail === null && allPush === null) {
    return currentChannels;
  }

  const channelsObject = {};
  currentChannels.forEach((currentChannel) => {
    const {name, pushEnabled, emailEnabled} = currentChannel;
    channelsObject[name] = {
      emailEnabled: allEmail !== null ? allEmail : emailEnabled,
      pushEnabled: allPush !== null ? allPush : pushEnabled,
    };
  });

  const responseChannels = await dataSources.Subscriptions.subscriptionChannels.updateSubscriptionChannels(userId, channelsObject);
  return queryChannelHandle(responseChannels);
};

const queryChannelHandle = (currentChannels) => {
  /*
   * 需要合并的条目对象数组
   * nameCombine表示合并 后 条目名称
   * nameExtent表示合并 前 条目名称列表
   * flag表示合并 后 对象pushEnabled的值
   */
  const specialArr = [
    {
      nameCombine: 'COMMENTS',
      pushFlag: false,
      emailFlag: false,
      nameExtent: ['COMMENT', 'COMMENT_MENTION'],
    },
    {
      nameCombine: 'YOUR_PHOTO',
      pushFlag: false,
      emailFlag: false,
      nameExtent: ['UPCOMING', 'POPULAR', 'EDITORS_CHOICE'],
    },
  ];

  currentChannels.forEach((currentChannel) => {
    const {name, pushEnabled, emailEnabled} = currentChannel;

    specialArr.forEach((special)=>{
      /*
       * 当前合并前对象的name是属于要合并的条目
       * 只要有一个合并前对象的pushEnabled是true，合并后对象的pushEnabled为true
       * 只要有一个合并前对象的emailEnabled是true，合并后对象的emailEnabled为true
       */
      if (special.nameExtent.includes(name)) {
        special.pushFlag = pushEnabled ? pushEnabled : special.pushFlag;
        special.emailFlag = emailEnabled ? emailEnabled : special.emailFlag;
      }
    });
  });

  // 追加新的合并后对象
  specialArr.forEach((special)=>{
    currentChannels.push({
      __typename: 'SubscriptionChannel',
      name: special.nameCombine,
      pushEnabled: special.pushFlag,
      emailEnabled: special.emailFlag,
    });
  });

  return currentChannels;
};

export const resolvers = {
  UserSetting: {
    subscriptionChannels: async ({__internalId, __subscriptionChannels}, _, {dataSources}) => {
      // Refetched after mutation
      if (__subscriptionChannels) return __subscriptionChannels;
      const currentChannels = await dataSources.Subscriptions.subscriptionChannels.getSubscriptionChannels(__internalId);
      return queryChannelHandle(currentChannels);
    },
  },
  Mutation: {
    updateAllUserSubscriptions: async (_, {input}, {dataSources, currentUserId}) => {
      const responseChannels = await handleUpdateAllUserSubscriptions(input, dataSources, currentUserId);

      return {
        userSetting: {
          __subscriptionChannels: responseChannels,
        },
      };
    },
    updateUserSubscriptions: async (_, {input}, {dataSources, currentUserId}) => {
      const responseChannels = await handleUpdateUserSubscriptions(input, dataSources, currentUserId);

      return {
        userSetting: {
          __subscriptionChannels: responseChannels,
        },
      };
    },
    updateAllUserSubscriptionsV2: async (_, {input}, {dataSources, currentUserId}) => {
      const responseChannels = await handleUpdateAllUserSubscriptions(input, dataSources, currentUserId);

      return {
        subscriptionChannels: responseChannels,
      };
    },
    updateUserSubscriptionsV2: async (_, {input}, {dataSources, currentUserId}) => {
      const responseChannels = await handleUpdateUserSubscriptions(input, dataSources, currentUserId);
      return {
        subscriptionChannels: responseChannels,
      };
    },
  },
};
