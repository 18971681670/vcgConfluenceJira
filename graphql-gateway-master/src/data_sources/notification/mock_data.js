// TODO: later
export const groupedNotificationList = [
  {
    'id': 1,
    'action': 'follow_user',
    'created_at': '2022-01-01T12:00:00',
    'links_data': [{'profile': 'pabramov'}],
    'content': '**Pavel Abramov** followed you!',
    'headers': [{'type': 'User', 'legacyId': 1001216179}],
    'extras': [
      {
        'type': 'FollowInteraction',
        'userLegacyId': 1001216179,
        'following': false,
      },
    ],
    'read': false,
  },
  {
    'id': 2,
    'action': 'photo_like',
    'created_at': '2022-01-02T12:00:00',
    'links_data': [{'profile': 'pabramov'}, {'photo': 1038742652}],
    'content': '**Pavel Abramov** liked your photo',
    'headers': [{'type': 'User', 'legacyId': 1001216179}],
    'extras': [
      {
        'type': 'Photo',
        'legacyId': 1038742652,
      },
    ],
    'read': false,
  },
  {
    'id': 3,
    'action': 'user_invited_to_group',
    'created_at': '2022-01-03T12:00:00',
    'links_data': [{'profile': 'pabramov'}, {'group': '500px-help'}],
    'content': '**Pavel Abramov** invited you to group __cats are great__',
    'headers': [{'type': 'User', 'legacyId': 1001216179}],
    'extras': [],
    'read': true,
  },
  {
    'id': 4,
    'action': 'photo_like',
    'created_at': '2022-01-04T12:00:00',
    'links_data': [{'notification': 4}, {'photo': 1038742652}],
    'content': '**Pavel Abramov**, **Ana Saragossa** and **2 others** liked your photo',
    'headers': [
      {'type': 'User', 'legacyId': 1001216179},
      {'type': 'User', 'legacyId': 72497311},
      {'type': 'User', 'legacyId': 1005187618},
      {'type': 'User', 'legacyId': 71686849},
    ],
    'extras': [
      {
        'type': 'Photo',
        'legacyId': 1038742652,
      },
    ],
    'read': false,
  },
  {
    'id': 5,
    'action': 'reached_popular',
    'created_at': '2022-01-05T12:00:00',
    'links_data': [{'photo': 1038742652}],
    'content': 'Your photo reached **Popular**!',
    'headers': [],
    'extras': [
      {
        'type': 'Photo',
        'legacyId': 1038742652,
      },
    ],
    'read': false,
  },
  {
    'id': 6,
    'action': 'photo_selected_for_shortlist',
    'created_at': '2022-01-06T12:00:00',
    'links_data': [{'quest': 1000000148}],
    'content': 'Your photo has been added to the **Best Cats** Quest',
    'headers': [],
    'extras': [
      {
        'type': 'Photo',
        'legacyId': 1038742652,
      },
    ],
    'read': false,
  },
];

export const groupedNotificationListAPI = [
  {
    'id': '1a4526a6-3cc7-4bfd-94c1-2e8a0f1f1efe', // 第一条合并的id
    'action': 'photo_like',
    'contentTemplate': '$[0] liked $[1] photos.',
    'createdAt': 'Mon Mar 14 11:56:24 EDT 2022',
    'read': false,
    'grouped': true,
    'groupedType': 'photo_like_photos',
    'subNotificationResponse': {
      'startCursor': '22222-5555555',
      'endCursor': '66666-8888888',
    },
    'actors': [
      {
        'type': 'USER',
        'id': '72497311',
      },
    ],
    'actees': [
      {
        'type': 'TEXT',
        'id': '5',
      },
    ],
  },
  {
    'id': '1a4526a6-3cc7-4bfd-94c1-2e8a0f1f1efe',
    'action': 'photo_like',
    'contentTemplate': '$[0], $[1] and $[2] others liked your photo.',
    'contentTemplate2': '$[0] and $[1] liked your photo.',
    'createdAt': 'Mon Mar 14 11:56:24 EDT 2022',
    'read': false,
    'grouped': true,
    'groupedType': 'photo_like_users',
    'subNotificationResponse': {
      'startCursor': '22222-5555555',
      'endCursor': '66666-8888888',
    },
    'actors': [
      {
        'type': 'USER',
        'id': '72497311',
      },
      {
        'type': 'USER',
        'id': '879',
      },
      {
        'type': 'TEXT',
        'id': '3',
      },
    ],
    'actees': [
      {
        'type': 'PHOTO',
        'id': '1000021053',
      },
    ],
  },
  {
    'id': '1a4526a6-3cc7-4bfd-94c1-2e8a0f1f1efe',
    'action': 'photo_added_to_gallery',
    'contentTemplate': '$[0] added $[1] photos to the $[2] Gallery.',
    'createdAt': 'Mon Mar 14 11:56:24 EDT 2022',
    'read': false,
    'grouped': true,
    'groupedType': 'photo_added_to_gallery_photos',
    'subNotificationResponse': {
      'startCursor': '22222-5555555',
      'endCursor': '66666-8888888',
    },
    'actors': [
      {
        'type': 'USER',
        'id': '72497311',
      },
    ],
    'actees': [
      {
        'type': 'TEXT',
        'id': '3',
      },
      {
        'type': 'GALLERY',
        'id': '5212153',
      },
    ],
  },
  {
    'id': '1a4526a6-3cc7-4bfd-94c1-2e8a0f1f1efe',
    'action': 'photo_added_to_gallery',
    'contentTemplate': '$[0] added $[1] photos to $[2] Galleries.',
    'createdAt': 'Mon Mar 14 11:56:24 EDT 2022',
    'read': false,
    'grouped': true,
    'groupedType': 'photo_added_to_gallery_galleries',
    'subNotificationResponse': {
      'startCursor': '22222-5555555',
      'endCursor': '66666-8888888',
    },
    'actors': [
      {
        'type': 'USER',
        'id': '879',
      },
    ],
    'actees': [
      {
        'type': 'TEXT',
        'id': '3',
      },
      {
        'type': 'TEXT',
        'id': '3',
      },
    ],
  },
];

export const singleNotificationListAPI = [
  {
    'id': '5bb84338-ddb7-452d-9ce3-5e7f27c90acc',
    'action': 'follow_user',
    'contentTemplate': '$[0] followed you!',
    'createdAt': 'Mon Mar 14 11:56:24 EDT 2022',
    'read': false,
    'grouped': false,
    'actors': [
      {
        'type': 'USER',
        'id': '71686849',
      },
    ],
    'actees': null,
  },
  {
    'id': '9be0f21f-d860-4be2-bfce-81cca2494749',
    'action': 'photo_like',
    'contentTemplate': '$[0] liked your photo.',
    'createdAt': 'Mon Mar 14 11:56:24 EDT 2022',
    'read': false,
    'grouped': false,
    'actors': [
      {
        'type': 'USER',
        'id': '72497311',
      },
    ],
    'actees': [
      {
        'type': 'PHOTO',
        'id': '1038742652',
      },
    ],
  },
  {
    'id': '1a4526a6-3cc7-4bfd-94c1-2e8a0f1f1efe',
    'action': 'photo_added_to_gallery',
    'contentTemplate': '$[0] added your photo to the $[1] Gallery.',
    'createdAt': 'Mon Mar 14 11:56:24 EDT 2022',
    'read': false,
    'grouped': false,
    'actors': [
      {
        'type': 'USER',
        'id': '1',
      },
    ],
    'actees': [
      {
        'type': 'PHOTO',
        'id': '1038742652',
      },
      {
        'type': 'GALLERY',
        'id': '1000000140',
      },
    ],
  },
  {
    'id': 'eac99be6-a056-4854-9b0c-c0744f51fe08',
    'action': 'photo_comment',
    'contentTemplate': '$[0] commented: \"$[1]\"',
    'createdAt': 'Mon Mar 14 11:56:24 EDT 2022',
    'read': false,
    'grouped': false,
    'actors': [
      {
        'type': 'USER',
        'id': '1000499980',
      },
    ],
    'actees': [
      {
        'type': 'PHOTO',
        'id': '1038742652',
      },
      {
        'type': 'COMMENT',
        'id': '1024632172',
      },
    ],
  },
  {
    'id': '0724d66a-c77d-4cff-8a18-c2d646fbd352',
    'action': 'photo_comment_mention',
    'contentTemplate': '$[0] commented: "$[1]"',
    'createdAt': 'Mon Mar 14 11:56:24 EDT 2022',
    'read': false,
    'grouped': false,
    'actors': [
      {
        'type': 'USER',
        'id': '26453267',
      },
    ],
    'actees': [
      {
        'type': 'PHOTO',
        'id': '1038742652',
      },
      {
        'type': 'COMMENT',
        'id': '423894193',
      },
    ],
  },
  {
    'id': 'cf3a5b25-ae60-4ef8-9860-4b7b7985f50c',
    'action': 'reached_popular',
    'contentTemplate': 'Your photo reached $[0]!',
    'createdAt': 'Mon Mar 14 11:56:24 EDT 2022',
    'read': false,
    'grouped': false,
    'actors': [
      {
        'type': 'PHOTO',
        'id': '1038742652',
      },
    ],
    'actees': [
      {
        'type': 'TEXT',
        'id': null,
        'text': 'Popular',
      },
    ],
  },
  {
    'id': 'e438969e-5b62-4680-8afa-36863b3ab441',
    'action': 'reached_upcoming',
    'contentTemplate': 'Your photo has made it to $[0]!',
    'createdAt': 'Mon Mar 14 11:56:24 EDT 2022',
    'read': false,
    'grouped': false,
    'actors': [
      {
        'type': 'PHOTO',
        'id': '1038742652',
      },
    ],
    'actees': [
      {
        'type': 'TEXT',
        'id': null,
        'text': 'Upcoming',
      },
    ],
  },
  {
    'id': 'fc53ef16-c12e-4a08-9af3-ef12be65ff01',
    'action': 'selected_by_editor',
    'contentTemplate': 'Your photo has made it to $[0]!',
    'createdAt': 'Mon Mar 14 11:56:24 EDT 2022',
    'read': false,
    'grouped': false,
    'actors': [
      {
        'type': 'PHOTO',
        'id': '1038742652',
      },
    ],
    'actees': [
      {
        'type': 'TEXT',
        'id': null,
        'text': 'Editor\'s Choice',
      },
    ],
  },
  {
    'id': 'e3a73708-bde5-4b6a-95fc-fbc7ca1d76a8',
    'action': 'photo_selected_for_shortlist',
    'contentTemplate': 'Your photo has been added to the $[0] Shortlist.',
    'createdAt': 'Mon Mar 14 11:56:24 EDT 2022',
    'read': false,
    'grouped': false,
    'actors': [
      {
        'type': 'QUEST',
        'id': '1000000008',
      },
    ],
    'actees': [
      {
        'type': 'PHOTO',
        'id': '1038742652',
      },
    ],
  },
  {
    'id': '20f0d98c-71ad-4562-8a04-f4d96be04b2a',
    'action': 'quest_winners_selected',
    'contentTemplate': 'Congratulations! Your photo won the $[0] Quest.',
    'createdAt': 'Mon Mar 14 11:56:24 EDT 2022',
    'read': false,
    'grouped': false,
    'actors': [
      {
        'type': 'QUEST',
        'id': '1000000008',
      },
    ],
    'actees': [
      {
        'type': 'PHOTO',
        'id': '1038742652',
      },
    ],
  },
  {
    'id': '78afab31-4bcf-466f-b64c-2752b8f5ece6',
    'action': 'quest_losers_selected',
    'contentTemplate': 'Winners have been selected for the $[0].',
    'createdAt': 'Mon Mar 14 11:56:24 EDT 2022',
    'read': false,
    'grouped': false,
    'actors': [
      {
        'type': 'QUEST',
        'id': '1000000008',
      },
    ],
    'actees': null,
  },
  {
    'id': '78afab31-4bcf-466f-b64c-2752b8f5ece6',
    'action': 'quest_started',
    'contentTemplate': 'New Quest! Submit your photos to $[0].',
    'createdAt': 'Mon Mar 14 11:56:24 EDT 2022',
    'read': false,
    'grouped': false,
    'actors': [
      {
        'type': 'QUEST',
        'id': '1000000008',
      },
    ],
    'actees': null,
  },
  {
    'id': '5bb84338-ddb7-452d-9ce3-5e7f27c90acc',
    'action': 'domain_connection_success',
    'contentTemplate': '$[0] is connected to your Portfolio!',
    'createdAt': 'Mon Mar 18 11:56:24 EDT 2022',
    'read': false,
    'grouped': false,
    'actors': [
      {
        'type': 'DOMAIN',
        'id': '1000000796',
      },
    ],
    'actees': null,
  },
  {
    'id': '5bb84338-ddb7-452d-9ce3-5e7f27c90acc',
    'action': 'domain_connection_failed',
    'contentTemplate': '$[0] has failed to connect to your Portfolio.',
    'createdAt': 'Mon Mar 18 11:56:24 EDT 2022',
    'read': false,
    'grouped': false,
    'actors': [
      {
        'type': 'DOMAIN',
        'id': '1000000796',
      },
    ],
    'actees': null,
  },
  {
    'id': '5bb84338-ddb7-452d-9ce3-5e7f27c90acc',
    'action': 'domain_dns_errors_found',
    'contentTemplate': 'Some of your DNS entries for $[0] are missing or incorrect. Please make necessary changes to your DNS settings.',
    'createdAt': 'Mon Mar 18 11:56:24 EDT 2022',
    'read': false,
    'grouped': false,
    'actors': [
      {
        'type': 'DOMAIN',
        'id': '1000000796',
      },
    ],
    'actees': null,
  },
  {
    'id': '5bb84338-ddb7-452d-9ce3-5e7f27c90acc',
    'action': 'domain_connection_failing',
    'contentTemplate': 'We are having an issue connecting with $[0]. Please make necessary changes to your DNS settings.',
    'createdAt': 'Mon Mar 18 11:56:24 EDT 2022',
    'read': false,
    'grouped': false,
    'actors': [
      {
        'type': 'DOMAIN',
        'id': '1000000796',
      },
    ],
    'actees': null,
  },
];
