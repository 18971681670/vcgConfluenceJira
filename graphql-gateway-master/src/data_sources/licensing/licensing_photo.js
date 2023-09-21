import {Node} from '../base/node';
import {CATEGORY_REVERSE_MAPPING, PRIVACY_MAPPING, PRIVACY_REVERSE_MAPPING} from '../photo/photo';
import {logger} from '../../utils/logger';

export const REMOVED_BY_TYPE_MAPPING = {
  1: 'UPLOADER',
  2: 'ADMINISTRATOR',
};
export const FEEDBACK_CODE_MAPPING = {
  710011: 'QUALITY_ISSUE',
  710012: 'WATERMARK_BORDER_ISSUE',
  710013: 'MODEL_RELEASE_REQUIRED',
  710014: 'PROPERTY_RELEASE_REQUIRED',
  710015: 'PERMISSION_REQUIRED',
  710016: 'COPYRIGHT_IP_ISSUE',

  710031: 'TAG_ISSUE',
  710032: 'SIGNED_MODEL_RELEASE_REQUIRED',
  710034: 'CONTACT_INFORMATION_ISSUE',
  710035: 'FILE_SIZE_ISSUE',

  710021: 'SEXUALLY_EXPLICIT',
  710022: 'INAPPROPRIATE_CONTENT',
  710023: 'SIMILAR_IMAGE_FOUND',
  710024: 'NO_MODEL_RELEASE_AND_NOT_SUITABLE_FOR_EDITORIAL',
  710025: 'NOT_SUITABLE_FOR_EDITORIAL',
  710026: 'EDITORIAL_INTEGRITY_ISSUE',
  710027: 'LIMITED_VALUE',
  710028: 'OUT_OF_FOCUS',
  710029: 'COPRIGHT_IP_ISSUE',
  7100210: 'GENERAL_TECHNICAL_ISSUE',
  7100240: 'MODEL_RELEASE_INVITATION_REJECTED',

};

export const FEEDBACK_MESSAGE_MAPPING = {
  710011: 'This photo has one or more of the following quality issues:<br/>' +
  '<br/>' +
  '- Improper exposure<br/>' +
  '- Excessive noise or grain<br/>' +
  '- Dust spots<br/>' +
  '- Visible retouching<br/>' +
  '- Chromatic aberration or color fringing<br/>' +
  '- Poor composition <a href="https://iso.500px.com/common-technical-photo-submission-issues/" target="_blank" rel="noopener noreferrer">Learn more</a>',
  710012: 'This photo contains either a watermark, border, signature, or creative / personalized text. <a href="https://iso.500px.com/10-mistakes-avoid-licensing-images/" target="_blank" rel="noopener noreferrer">Learn more</a>',
  710013: 'A model release is required for this photo and isn\'t attached, or required information is missing. You may also see this message if a release is attached to an image that doesn\'t require one. If so, please remove it and re-submit. <a href="https://iso.500px.com/13-things-might-not-realize-model-property-releases/" target="_blank" rel="noopener noreferrer">Learn more</a>',
  710014: 'A property release is required for this photo and isn\'t attached, or required information is missing. You may also see this message if a release is attached to an image that doesn\'t require one. If so, please remove it and re-submit. <a href="https://iso.500px.com/unexpected-images-that-require-a-property-release/" target="_blank" rel="noopener noreferrer">Learn more</a>',
  710015: 'Permission from the venue is required in the form of a property release, press pass, photography permit, or letter issued by the event manager. <a href="https://iso.500px.com/3-releases-you-need-when-licensing-photos/" target="_blank" rel="noopener noreferrer">Learn more</a>',
  710016: 'One or more of the following are visible in the photo:<br/>' +
  '<br/>' +
  '- Logo<br/>' +
  '- Branding<br/>' +
  '- Trademarked item<br/>' +
  '- Copyrighted content<br/>' +
  '- Vehicle registration number<br/>' +
  '- Animal or livestock tag <a href="https://iso.500px.com/intellectual-property-things-to-know/" target="_blank" rel="noopener noreferrer">Learn more</a>',
  710031: 'This photo does not have enough keywords. Please add at least 5 keywords that are relevant and describe this image.',
  710032: 'We noticed a problem with your submission. For commercial purposes, you must submit a signed model release for each recognizable person(s) in your photo, even if it\'s a self portrait. Make sure the Release Request Form has a status of Signed, then click Save to re-submit the photo for licensing with a signed release.',
  710034: 'Please make sure your contact information is up to date. You will not be able to license your photos before completing this step. This information allows us to reach out right away when you have a pending sale. It also adds an additional layer of security to ensure that you are the only one accessing your account. <a target=\'_blank\' href=\'/settings/contact_verification\'>Confirm your contact information here</a>',
  710035: 'This photo is too small. Images must be at least 3 megapixels to be accepted for Licensing (2000px x 1500px = 3,000,000px = 3MP).',


  710021: 'This photo shows exposed breasts, buttocks, genitals, or is too sexually suggestive.',
  710022: 'This photo contains content that buyers could find offensive or distaseful. ',
  710023: 'We have already accepted content that is very similar to this. Photos must be different enough to provide added value to the collection and potential buyers.  <a href="https://iso.500px.com/creating-a-diverse-licensing-portfolio/" target="_blank" rel="noopener noreferrer">Learn more</a>',
  710024: 'There are unreleased people in this photo, and it doesn\'t have a strong editorial use.  <a href="https://iso.500px.com/understanding-the-differences-between-commercial-editorial-photography/" target="_blank" rel="noopener noreferrer">Learn more</a>',
  710025: 'This photo doesn\'t have an editorial purpose for news, reporting, criticism, or commentary.  <a href="https://iso.500px.com/understanding-the-differences-between-commercial-editorial-photography/" target="_blank" rel="noopener noreferrer">Learn more</a>',
  710026: 'This photo has been altered in a way that it may no longer be factual and cannot be used editorially. ',
  710027: 'There is little commercial demand for this type of content. The type of content that sells well communicates something to the viewer, has a nice visual aesthetic, and is technically well executed.  <a href="https://iso.500px.com/10-mistakes-avoid-licensing-images/" target="_blank" rel="noopener noreferrer">Learn more</a>',
  710028: 'This photo is not completely sharp or in focus when viewed at 100%.',
  710029: 'This photo contains an element(s) that is protected by intellectual property laws, such as a logo, brand, trademarked item, architecture, artwork, venues, landmarks, monuments, etc.',
  7100210: 'This photo contains one or more of the following technical issues:<br/>' +
  '<br/>' +
  '- Extreme noise, grain, or digital artifacts<br/>' +
  '- Poor or uneven lighting<br/>' +
  '- Compression issues<br/>' +
  '- Pixelation<br/>' +
  '- Posterization<br/>' +
  '- Banding  <a href="https://iso.500px.com/common-technical-photo-submission-issues/" target="_blank" rel="noopener noreferrer">Learn more</a>',
  7100240: 'One or more of your models rejected the Model Release. This photo can\'t be accepted to Licensing.',

};

export const FEEDBACK_MESSAGE_MAPPING_V2 = {
  710011: 'Adjust your photo to address any of the following:<br/>' +
    '<li>Improper exposure</li>' +
    '<li>Excessive noise or grain</li>' +
    '<li>Dust spots or dirty lens</li>' +
    '<li>Visible retouching</li>' +
    '<li>Chromatic aberration or colour fringing</li>' +
    '<li>Poor composition</li> <a href="https://iso.500px.com/common-technical-photo-submission-issues/" target="_blank" rel="noopener noreferrer">Learn more</a>',
  710012: 'Adjust your photo to address any of the following:<br/>' +
    '<li>Watermark</li>' +
    '<li>Border</li>' +
    '<li>Signature</li>' +
    '<li>Creative or Personalized text</li> <a href="https://iso.500px.com/10-mistakes-avoid-licensing-images/" target="_blank" rel="noopener noreferrer">Learn more</a>',
  710013: 'Let’s get your submission reviewed quickly. Please submit a model release for each identifiable person in your photo.',
  710014: 'We spotted one or more properties in your photo. This could be either buildings, artwork, or tattoos. Please submit a release for each, to help us with a timely review.',
  710015: 'Permission from the venue is required in the form of a property release, press pass, photography permit, or letter issued by the event manager. <a href="https://iso.500px.com/3-releases-you-need-when-licensing-photos/" target="_blank" rel="noopener noreferrer">Learn more</a>',
  710016: 'Adjust your photo to address any of the following:<br/>' +
    '<li>Logo</li>' +
    '<li>Branding</li>' +
    '<li>Trademarked item</li>' +
    '<li>Copyrighted content</li>' +
    '<li>Vehicle registration number</li>' +
    '<li>Animal or livestock tag</li> <a href="https://iso.500px.com/intellectual-property-things-to-know/" target="_blank" rel="noopener noreferrer">Learn more</a>',
  710031: 'This photo does not have enough keywords. Please add at least 5 keywords that are relevant and describe this image.',
  710032: 'We noticed a problem with your submission. For commercial purposes, you must submit a signed model release for each recognizable person(s) in your photo, even if it\'s a self portrait. Make sure the Release Request Form has a status of Signed, then click Save to re-submit the photo for licensing with a signed release.',
  710034: 'Please make sure your contact information is up to date. You will not be able to license your photos before completing this step. This information allows us to reach out right away when you have a pending sale. It also adds an additional layer of security to ensure that you are the only one accessing your account. <a target=\'_blank\' href=\'/settings/contact_verification\'>Confirm your contact information here</a>',
  710035: 'This photo is too small. Images must be at least 3 megapixels to be accepted for Licensing (2000px x 1500px = 3,000,000px = 3MP).',


  710021: 'Your photo contains subject matter that is either too sexually sensitive, shows exposed breasts, buttocks, or genitals.',
  710022: 'Your photo contains content that could be viewed as offensive or inappropriate to buyers.',
  710023: 'We may have already accepted similar content. Photos should be unique enough to ensure we appeal to potential buyers, and add value to our collection.  <a href="https://iso.500px.com/creating-a-diverse-licensing-portfolio/" target="_blank" rel="noopener noreferrer">Learn more</a>',
  710024: 'There are unreleased people in this photo, and it doesn\'t have a strong editorial use.  <a href="https://iso.500px.com/understanding-the-differences-between-commercial-editorial-photography/" target="_blank" rel="noopener noreferrer">Learn more</a>',
  710025: 'This photo doesn\'t have an editorial purpose for news, reporting, criticism, or commentary.  <a href="https://iso.500px.com/understanding-the-differences-between-commercial-editorial-photography/" target="_blank" rel="noopener noreferrer">Learn more</a>',
  710026: 'This photo has been altered in a way that it may no longer be factual and cannot be used editorially. ',
  710027: 'Your photo may not have enough commercial potential. Content that sells well is visually pleasing, communicates something to the viewer, and is technically well-executed.  <a href="https://iso.500px.com/10-mistakes-avoid-licensing-images/" target="_blank" rel="noopener noreferrer">Learn more</a>',
  710028: 'Your photo is blurry or out of focus and may not be perfectly sharp when viewed at 100% magnification.',
  710029: 'Your photo contains any of the following items that are protected by intellectual property laws.<br/>' +
    '<li>Logo, brand, or trademark visible</li>' +
    '<li>Copyrighted content</li>' +
    '<li>Problematic location</li>' +
    '<li>Artwork/graffiti</li>  <a href="https://iso.500px.com/common-technical-photo-submission-issues/" target="_blank" rel="noopener noreferrer">Learn more</a>',
  7100210: 'Your photo may contain any of the following:<br/>' +
    '<li>Excessive noise or grain</li>' +
    '<li>Dust spots or dirty lens</li>' +
    '<li>Out of focus</li>' +
    '<li>Pixelation</li>' +
    '<li>Posterization or banding</li>' +
    '<li>Oversaturation</li>' +
    '<li>Over use of filters or HDR</li>' +
    '<li>Underexposed</li>' +
    '<li>Overexposed</li>' +
    '<li>Over-sharpened</li>  <a href="https://iso.500px.com/common-technical-photo-submission-issues/" target="_blank" rel="noopener noreferrer">Learn more</a>',
  7100240: 'One or more of your models rejected the Model Release. This photo can\'t be accepted to Licensing.',

};

export const FEEDBACK_TITLE_MAPPING = {
  710011: 'Quality issue',
  710012: 'Watermark or border issue',
  710013: 'Model release required',
  710014: 'Property release required',
  710015: 'Permission required',
  710016: 'Copyright or IP issue',

  710031: 'Missing keywords',
  710032: 'Signed Model Release Required',
  710034: 'Contact Information Issue',
  710035: 'Small image size',

  710021: 'Sexually explicit content',
  710022: 'Inappropriate content',
  710023: 'Similar image(s) already submitted or accepted',
  710024: 'No model release and not suitable for editorial',
  710025: 'Not suitable for editorial',
  710026: 'Editorial Integrity Issue',
  710027: 'Limited commercial demand',
  710028: 'Image out of focus',
  710029: 'IP issue',
  7100210: 'General technical reasons',
  7100240: 'Models rejected the Model Release',


};

export const FEEDBACK_TITLE_MAPPING_V2 = {
  710011: 'Quality',
  710012: 'Watermark/border',
  710013: 'Model release required',
  710014: 'Property release required',
  710015: 'Permission required',
  710016: 'Copyright',

  710031: 'Missing keywords',
  710032: 'Signed Model Release Required',
  710034: 'Contact Information Issue',
  710035: 'Small image size',

  710021: 'Sexually Explicit',
  710022: 'Inappropriate content',
  710023: 'Similar images',
  710024: 'No model release and not suitable for editorial',
  710025: 'Not suitable for editorial',
  710026: 'Editorial Integrity Issue',
  710027: 'Limited commercial appeal',
  710028: 'Image out of focus',
  710029: 'Intellectual property issue',
  7100210: 'Quality issue',
  7100240: 'Models rejected the Model Release',
};
/**
 * API representing LicensingPhoto from licensing
 */
export class LicensingPhoto extends Node {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'licensing';
  }

  /**
   * Get the unique resource type, which will be used for generate global
   * resource ID
   * @return {string} The name of microservice in K8
   */
  get resourceType() {
    return 'LicensingPhoto';
  }

  /**
   * Whether a resource is queryable through the `node` or `nodeByLegacyId` queries.
   * @return {Boolean} Whether the resource is queryable. `false` by default.
   */
  get queryable() {
    return true;
  }

  /**
   * Compute the caching hint for a licensing photo
   * @param {*} obj The object
   * @return {*} Caching hint
   */
  cacheHint(obj) {
    if (!this.currentUserId) {
      // anonymous
      return {
        maxAge: 600,
        scope: 'PUBLIC',
      };
    } else if (this.currentUserId != obj.user_id) {
      // logged-in but not the owner
      return {
        maxAge: 600,
        scope: 'PRIVATE',
      };
    } else {
      // logged-in and the owner
      return {
        maxAge: 0,
        scope: 'PRIVATE',
      };
    }
  }

  /**
   * Map API response to LicensingPhoto schema
   * @param {Object} obj An item from API response
   * @return {Object} An object under GraphQL schema
   */
  reducer(obj) {
    return {
      ...super.reducer(obj),

      caption: obj.title,
      description: obj.description,
      keywords: (obj.keywords && obj.keywords.split(',')) || [],
      width: obj.width,
      height: obj.height,
      exclusiveUsage: obj.exclusive_use,
      collection: (obj.brand && obj.brand.toUpperCase()) || null,
      gettyId: obj.getty_id,
      vcgId: obj.vcg_id,
      fileName: obj.file_name,

      latitude: obj.latitude,
      longitude: obj.longitude,
      location: obj.location,
      aperture: obj.aperture,
      shutterSpeed: obj.shutter_speed,
      focalLength: obj.focal_length,
      iso: obj.iso,
      camera: obj.camera,
      lens: obj.lens,
      orientation: (obj.orientation && obj.orientation.toUpperCase()) || null,

      status: obj.status,

      takenAt: obj.taken_at,
      submittedAt: obj.submission_date,

      updatedAt: obj.updated_at,
      createdAt: obj.created_at,

      acceptedAt: obj.licensing_photo_extra_info.accepted_at,
      removedAt: obj.licensing_photo_extra_info.removed_at,
      removedBy: REMOVED_BY_TYPE_MAPPING[obj.licensing_photo_extra_info.removed_by],

      reuploaded: !!obj.licensing_photo_extra_info.reuploaded,
      modelReleaseChanged: !!obj.licensing_photo_extra_info.model_release_changed,
      propertyReleaseChanged: !!obj.licensing_photo_extra_info.property_release_changed,

      downloadLink: obj.download_link,
      soldTimes: obj.sold_times,
      totalEarnings: obj.total_earnings,
      privacy: PRIVACY_MAPPING[obj.privacy],
      photoStatus: obj.photo_status,
      resubmit: obj.resubmit,

      feedbacks: (obj.reason_list && obj.reason_list.map((item) => {
        if (item.code == 0) {
          if (item.message.includes('#005')) {
            return {
              code: FEEDBACK_CODE_MAPPING[710035],
              title: FEEDBACK_TITLE_MAPPING[710035],
              message: FEEDBACK_MESSAGE_MAPPING[710035],
            };
          }
          if (item.message.includes('#001')) {
            return {
              code: FEEDBACK_CODE_MAPPING[710031],
              title: FEEDBACK_TITLE_MAPPING[710031],
              message: FEEDBACK_MESSAGE_MAPPING[710031],
            };
          }
          return {
            code: 'EDITOR_INPUT',
            title: 'Editor Input',
            message: item.message,
          };
        }
        return {
          code: FEEDBACK_CODE_MAPPING[item.code],
          title: FEEDBACK_TITLE_MAPPING[item.code],
          message: FEEDBACK_MESSAGE_MAPPING[item.code],
        };
      })) || [],
      feedbacksV2: (obj.reason_list && obj.reason_list.map((item) => {
        if (item.code == 0) {
          if (item.message.includes('#005')) {
            return {
              code: FEEDBACK_CODE_MAPPING[710035],
              title: FEEDBACK_TITLE_MAPPING[710035],
              message: FEEDBACK_MESSAGE_MAPPING[710035],
            };
          }
          if (item.message.includes('#001')) {
            return {
              code: FEEDBACK_CODE_MAPPING[710031],
              title: FEEDBACK_TITLE_MAPPING[710031],
              message: FEEDBACK_MESSAGE_MAPPING[710031],
            };
          }
          return {
            code: 'EDITOR_INPUT',
            title: 'Editor Input',
            message: item.message,
          };
        }
        return {
          code: FEEDBACK_CODE_MAPPING[item.code],
          title: FEEDBACK_TITLE_MAPPING_V2[item.code],
          message: FEEDBACK_MESSAGE_MAPPING_V2[item.code],
        };
      })) || [],
      __imageVersion: obj.stored_at,
      __contributorUserId: obj.user_id,
      __uploaderUserId: obj.user_id,
    };
  }

  /**
   * Aysnc bulk fetch information of LicensingPhoto resources
   * @param {Array} keys An array of keys for bulk loading
   * @return {Promise<Array>} A promise which will return an array of response from API corresponding
   * to the exact sequence of requested keys
   */
  async bulkLoadData(keys) {
    const qs = {
      ids: keys.join(','),
    };

    const response = await this.get(`internal/graphql/licensingPhotos/findByIds`, qs);

    return keys.map((id) => {
      return (response[id] || null);
    });
  }

  /**
   * mult-Submit a photo to licensing
   * @param {*} input
   */
  async bulkCreate(input) {
    const body = input.operations.map(((item) => {
      return {
        id: item.photoLegacyId,
        title: item.caption,
        category: CATEGORY_REVERSE_MAPPING[item.category],
        privacy: PRIVACY_REVERSE_MAPPING[item.privacy],
        exclusive_use: item.exclusiveUsage,
        latitude: item.latitude,
        longitude: item.longitude,
        location: item.location,
        keywords: (item.keywords && item.keywords.join(',')) || '',

        file_name: item.fileName,
        description: item.description,
        width: item.width,
        height: item.height,


        taken_at: item.takenAt,
        aperture: item.aperture,
        shutter_speed: item.shutterSpeed,
        focal_length: item.focalLength,
        iso: item.iso,
        camera: item.camera,
        lens: item.lens,

        status: (!!item.recognizablePeople || !!item.recognizableProperties ) ? 'RELEASE_REQUIRED' : null,
        recognizable_properties: !!item.recognizableProperties,
        recognizable_people: !!item.recognizablePeople,
        model_release: (item.modelReleaseLegacyIds && item.modelReleaseLegacyIds.join(',')) || '',
        property_release: (item.propertyReleaseLegacyIds && item.propertyReleaseLegacyIds.join(',')) || '',

        auto_licensing: item.autoLicensing || false,
      };
    }));
    const response = await this.post('internal/graphql/licensingPhotos', body);
    return response.map((item) =>{
      return this.reducer(item);
    });
  }


  /**
   * mult-reSubmit to licensing
   * @param {*} input
   */
  async bulkUpdate(input) {
    const body = input.operations.map(((item) => {
      return {
        id: item.legacyId,
        stored_at: item.reUploadInput? 'true' : null,
        file_name: item.reUploadInput && item.reUploadInput.fileName,
        width: item.reUploadInput && item.reUploadInput.width,
        height: item.reUploadInput && item.reUploadInput.height,

        model_release: (item.modelReleaseLegacyIds && item.modelReleaseLegacyIds.join(',')) || '',
        property_release: (item.propertyReleaseLegacyIds && item.propertyReleaseLegacyIds.join(',')) || '',
        submit_to_cms: item.submitToCms == null || item.submitToCms,
        // status: item.recognizablePeople!=null && item.recognizablePeople==false && item.recognizableProperties!=null && item.recognizableProperties==false ? 'CHANGE_REQUIRED' : null,
        status: item.recognizablePeople!=null && item.recognizablePeople==false ? 'CHANGE_REQUIRED' : null,
        recognizable_properties: !!item.recognizableProperties,
        recognizable_people: !!item.recognizablePeople,

        auto_licensing: item.autoLicensing || false,
      };
    }));
    const response = await this.post('internal/graphql/licensingPhotos/resubmit', body);
    return response.map((item) =>{
      return this.reducer(item);
    });
  }


  /**
   * mult-remove from licensing
   * @param {*} input
   */
  async bulkDestory(input) {
    const qs = {
      ids: input.legacyIds,
    };
    const response = await this.delete('internal/graphql/licensingPhotos', qs);
    return response.map((item) =>{
      return this.reducer(item);
    });
  }

  /**
   * re-upload  licensing photo to s3
   * @param {*} input
   */
  async reUploadLicensingPhoto(input) {
    const qs = {
      id: input.legacyId,
    };
    const response = await this.get(`internal/graphql/licensingPhotos/reupload`, qs);

    return {
      legacyId: input.legacyId,
      directUpload: {
        url: response.presigned_post.url,
        fields: JSON.stringify(response.presigned_post.fields),
      },
    };
  }

  /**
   * async generate suggest photo.
   *
   * @param {long} photoId - photoId
   */
  async asyncGenerateSuggest(photoId) {
    logger.info('the photoId to be suggested:' + photoId);
    return await this.post(`internal/graphql/asyncGenerateSuggest/${photoId}`);
  }

  /**
   * mark photo private
   * @param {Number} internalId Internal photo id
   * @param {Object} input privacy level params
   */
  async updateLicensingPrivacy(internalId, input) {
    const mappingConfig = {
      convertedMapping: {
        privacy: {
          conversion: PRIVACY_REVERSE_MAPPING,
        },
      },
    };

    const body = this.inputToBody(input, mappingConfig);
    await this.post(`internal/graphql/licensingPhotos/${internalId}/privacy`, body);
  }
}
