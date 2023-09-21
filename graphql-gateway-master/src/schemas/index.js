import fs from 'fs';
import path from 'path';
import {gql} from 'apollo-server-core';

// eslint-disable-next-line no-unused-vars
const OTHER_SDL = `
  interface UserProfileSocialLink {
    url: String!
  }

  type UserProfileSocialLinkInstagram implements UserProfileSocialLink {
    url: String!
    handle: String!
  }

  type UserProfileSocialLinkFacebook implements UserProfileSocialLink {
    url: String!
    id: String!
  }

  type UserProfileSocialLinkTwitter implements UserProfileSocialLink {
    url: String!
    handle: String!
  }

  type UserProfileSocialLinkWebsite implements UserProfileSocialLink {
    url: String!
  }

  type UserProfile {
    id: ID!
    about: String
    city: String
    state: String
    country: String

    googleAnalyticsCode: String

    cover(sizes: [UserProfileCoverResizeImageSize]): [UserProfileCoverResizeImage!]

    tabs: [UserProfileTab!]!

    socialLinks: [UserProfileSocialLink!]!
  }

  enum UserProfileCoverResizeImageSize {
    CARD
    NORMAL
  }

  """
  User cover images
  """
  type UserProfileCoverResizeImage {
    size: UserProfileCoverResizeImageSize!
    url: String!
  }

  interface UserProfileTab {
    displayed: Boolean!
  }

  type UserProfileTabPhotos implements UserProfileTab {
    displayed: Boolean!
    photos: PhotoConnection!
  }

  type UserProfileTabGalleries implements UserProfileTab {
    displayed: Boolean!
    galleries: GalleryConnection!
  }

  type UserProfileTabFeaturedGallery implements UserProfileTab {
    displayed: Boolean!
    gallery: Gallery!
  }

  type UserProfileTabLicensing implements UserProfileTab {
    displayed: Boolean!
  }

  type UserProfileTabGroups implements UserProfileTab {
    displayed: Boolean!
  }

  type UserProfileTabWorkshops implements UserProfileTab {
    displayed: Boolean!
  }

  type UserProfileTabAbout implements UserProfileTab {
    displayed: Boolean!
  }

  type UserProfileTabServices implements UserProfileTab {
    displayed: Boolean!
  }

  type Camera implements Node {
    id: ID!
    name: String!
  }

  type Lens implements Node {
    id: ID!
    name: String!
  }

  type Pulse {
    current: Float
    highest: Float
    highestAt: String
  }

  interface ContentStream {
    enteredAt: String!
  }

  type ContentStreamFresh implements ContentStream {
    enteredAt: String!
  }

  type ContentStreamUpcoming implements ContentStream {
    enteredAt: String!
  }

  type ContentStreamPopular implements ContentStream {
    enteredAt: String!
  }

  type ContentStreamEditorsChoice implements ContentStream {
    enteredAt: String!
    selectedBy: User
  }

  type CommentReply implements Node {
    id: ID!
    body: String!
    poster: User!
  }

  type CommentReplyEdge {
    cursor: String
    node: CommentReply
  }

  type CommentReplyConnection {
    edges: [CommentReplyEdge!]!
    pageInfo: PageInfo!
    totalCount: Int!
  }

  type Comment implements Node {
    id: ID!
    body: String!
    poster: User!

    replies: CommentReplyConnection
  }

  type CommentEdge {
    cursor: String
    node: Comment
  }

  type CommentConnection {
    edges: [CommentEdge!]!
    pageInfo: PageInfo!
    totalCount: Int!
    commentAndReplyTotalCount: Int!
  }
`;


/**
 * Find all files in a folder recursively
 * @param {string} dir the folder to scan
 * @return {Array<string>} a list of file pathes found in the given folder
 */
function walkSync(dir) {
  if (!fs.lstatSync(dir).isDirectory()) return dir;

  return fs.readdirSync(dir).map((f) => walkSync(path.join(dir, f))).flat();
}

/**
 * Generate the combined GraphQL SDL for the entire project
 * @return {string} The GraphQL SDL
 */
function loadSchema() {
  const files = walkSync('./src/schemas').filter((path) => path.endsWith('.graphqls'));
  const mergedSdl = files.map((path) => {
    console.log(`Loading schema from ${path}`);
    const content = fs.readFileSync(path, 'utf8');
    try {
      gql(content);
    } catch (e) {
      console.log(`\nError detected at ${path}!!! \n${e}`);
      process.exit(-1);
    }
    return `
# === BEGIN schema partial from ${path} ===
${content}
# === END schema partial from ${path} ===`;
  }).join('\n');
  return mergedSdl;
}

export const SCHEMA_SDL = loadSchema();

export const typeDefs = gql(SCHEMA_SDL);
