import {API} from '../base/api';
/**
 * API representing Specialty objects
 */
export class Specialties extends API {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'userprofile';
  }
  /**
   * Specialty
   */
  get resourceType() {
    return 'Specialty';
  }

  /**
   * Create a list of specialties on a Resume.
   *
   * @param {Array} specialtiesList - array of objects
   * @return {Specialties} The list of created specialties
   */
  async create(specialtiesList) {
    const {specialties} = await this.post(`internal/resume/specialties`, specialtiesList);
    return specialties;
  }

  /**
   * Create a list of specialties on a Resume.
   *
   * @param {specialties} specialties - array of objects
   * @return {Specialties} The list of created specialties
   */
  async update(specialties) {
    return await this.put(`internal/resume/specialties`, specialties);
  }

  /**
   * Delete Specialties
   * @param {Array} specialtyNames
   * @param {Specialties} Specialties to be deleted
   */
  async del(specialtyNames) {
    // If specialty names is undefined, all specialties will be deleted
    const qs = (specialtyNames && specialtyNames.length > 0) ?
      this.tidyQuery({specialties: specialtyNames}) :
      {};

    // This doesn't wait for specialties to actually get deleted
    return await this.delete(`internal/resume/specialties`, qs);
  }

  /**
   * Get a list of specialties on a Resume.
   *
   * @param {string} resumeId - the resume legacy id
   * @return {Specialties} The list of created specialties
   */
  async findByResumeId(resumeId) {
    const qs = this.tidyQuery({resumeId});
    const {specialties} = await this.get(`internal/resume/specialties`, qs);
    return specialties;
  }
};
