import {Node} from '../base/node';
/**
 * API representing Resume objects
 */
export class Resume extends Node {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'userprofile';
  }
  /**
   * Resume
   */
  get resourceType() {
    return 'Resume';
  }
  /**
   * Map API response
   * @param {ResumeAPIResponse} obj An item from API response
   * @return {Resume} An object under GraphQL schema
   */
  reducer(obj) {
    obj.id = obj.user_id;
    return {
      ...super.reducer(obj),
      about: obj.biography,
      yearsExperience: obj.years_experience,
      testimonials: obj.testimonials,
    };
  }
  /**
   * Creates a resume.
   *
   * @param {object} input
   * @return {Resume} The new resume
   */
  async create(input) {
    const body = {
      biography: input.about,
      years_experience: input.yearsExperience,
      testimonials: input.testimonials,
    };

    const {resume} = await this.put(`internal/resume`, body);
    return this.reducer(resume);
  }

  /**
   * Updates a resume.
   *
   * @param {object} input
   * @return {Resume} The updated resume
   */
  async update(input) {
    const body = {
      biography: input.about,
      years_experience: input.yearsExperience,
      testimonials: input.testimonials,
    };

    const {resume} = await this.put(`internal/resume`, body);
    return this.reducer(resume);
  }

  /**
   * Aysnc bulk fetch information of Resume resources
   * @param {Array} keys An array of keys for bulk loading
   * @return {Promise<Array>} A promise which will return an array of response from API corresponding
   * to the exact sequence of requested keys
   */
  async bulkLoadData(keys) {
    const qs = {
      ids: keys.join(','),
    };

    const {resumes} = await this.get(`internal/resume/getByIds`, qs);
    if (resumes.length === 0) {
      return [null];
    };

    return resumes;
  }

  /**
   * Deletes an existing resume.
   *
   * @return {String} The deleted resume id
   */
  async del() {
    const response = await this.delete(`internal/resume`);
    return this.reducer({user_id: response.resume_id});
  }

  /**
   * Get resume by Id
   * @param {string} resumeId
   * @return {Resume} Resume associated with the resumeId
   */
  async getResume(resumeId) {
    const {resume} = await this.get(`internal/resume/getByIds/${resumeId}`);
    return this.reducer(resume);
  }

  /**
   * Get galleryIds
   * @param {string} resumeId
   * @return {GalleryIds} GalleryIds associated with the specialties of specified resume
   */
  async getGalleryIds(resumeId) {
    const response = await this.get(`internal/resume/specialties/galleries`, this.tidyQuery({id: resumeId}));
    return response.gallery_ids;
  }
};
