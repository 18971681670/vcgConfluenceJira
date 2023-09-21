import {Node} from '../base/node';
import {logger} from '../../utils/logger';

/**
 * API representing Quest from quest
 */
export class Quest extends Node {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'contest';
  }

  /**
   * Get the unique resource type, which will be used for generate global
   * resource ID
   * @return {string} The name of microservice in K8
   */
  get resourceType() {
    return 'Quest';
  }

  /**
   * Whether a resource is queryable through the `node` or `nodeByLegacyId` queries.
   * @return {Boolean} Whether Quest resource is queryable. `false` by default.
   */
  get queryable() {
    return true;
  }

  /**
   * Compute the caching hint for a quest
   * @param {*} obj The object
   * @return {*} Caching hint
   */
  cacheHint(obj) {
    switch (obj.status) {
      case 'published':
        // cache for 1m for published, but not completed quests
        return {
          maxAge: 60,
          scope: 'PUBLIC',
        };
      case 'completed':
        // cache for 1d for completed quests (winner already selected)
        return {
          maxAge: 86400,
          scope: 'PUBLIC',
        };
      default:
        // no cache and private for draft quests (internal onely)
        return {
          maxAge: 0,
          scope: 'PRIVATE',
        };
    }
  }

  /**
   * Map API response to Quest schema
   * @param {Object} obj An item from API response
   * @return {Object} An object under GraphQL schema
   */
  reducer(obj) {
    return {
      ...super.reducer(obj),

      status: obj.status.toUpperCase(),

      title: obj.local_translation.title,
      slug: obj.slug,
      brief: obj.local_translation.brief,
      rules: obj.local_translation.rules,
      tips: obj.local_translation.tips,
      licensingDescription: obj.local_translation.licensing_description,

      licensing: obj.licensing,

      startsAt: obj.starts_at,
      endsAt: obj.ends_at,
      completedAt: obj.completed_at,

      multiTopic: !!obj.multi_topic,

      prizeName: obj.local_translation.prize_name,
      prizeDescription: obj.local_translation.prize,
      prizeImageUrl: obj.prize_image_url,

      __coverPhotoId: obj.cover_photo_id,

      __inspirationGalleryId: obj.sample_gallery_id,

      __judgeUserId: obj.judge_id,
      judgeBio: obj.judge_bio,
      winnerPageUrl: obj.winner_page_url,

      sponsorName: obj.local_translation.sponsor_name,
      sponsorLogoUrl: obj.sponsor_logo_url,
      sponsorBlurb: obj.local_translation.sponsor_blurb,
      brandBlurb: obj.local_translation.sponsor_blurb,

      brandImageryUrl: obj.brand_imagery_url,
      brandCtaLabel: obj.local_translation.sponsor_cta_label,
      brandCtaUrl: obj.sponsor_cta_url,
    };
  }

  /**
   * Aysnc bulk fetch information of Quest resources
   * @param {Array} keys An array of keys for bulk loading
   * @return {Promise<Array>} A promise which will return an array of response from API corresponding
   * to the exact sequence of requested keys
   */
  async bulkLoadData(keys) {
    const qs = {
      ids: keys.join(','),
      markdown: true,
      userlocale: this.context.viewerLanguage,
    };

    const response = await this.get(`internal/graphql/quests/findByIds`, qs);

    const lookupById = response.reduce(function(map, obj) {
      map[obj.id] = obj;
      return map;
    }, {});

    return keys.map((id) => {
      return (lookupById[id] || null);
    });
  }
}
