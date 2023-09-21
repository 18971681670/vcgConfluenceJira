import {Node} from '../base/node';

/**
 * Folder Class
 */
export class Folder extends Node {
  /**
   * Get the service host name which manages the given data nodes
   * @return {string} The name of microservice in K8
   */
  get serviceName() {
    return 'portfolios';
  }

  /**
   * Folder type
   */
  get resourceType() {
    return 'Folder';
  }

  /**
   * Map API response
   * @param {FolderResponse} obj An item from API response
   * @return {Folder} An object under GraphQL schema
   */
  reducer(obj) {
    return {
      id: obj.id,
      name: obj.name,
      description: obj.description,
      createdAt: obj.createdAt,
      updatedAt: obj.updatedAt,
      portfolioId: obj.portfolioId,
      __coverPhotoId: obj.coverPhotoId,
      __userId: obj.portfolioId,
      __photoIds: obj.photoIds,
    };
  }

  /**
   * Create a folder
   * @param {*} portfolioId
   * @param {*} folderUpsertRequest
   */
  async create(portfolioId, folderUpsertRequest) {
    const resp = await this.post(`internal/portfolios/folders/${portfolioId}`, folderUpsertRequest);
    return this.reducer(resp);
  }
  /**
   * Update a folder
   * @param {*} folderId
   * @param {*} folderUpsertRequest
   */
  async update(folderId, folderUpsertRequest) {
    const resp = await this.patch(`internal/portfolios/folders/${folderId}`, folderUpsertRequest);
    return this.reducer(resp);
  }

  /**
   * Delete a folder
   * @param {*} folderId
   */
  async deleteFolder(folderId) {
    const resp = await this.delete(`internal/portfolios/folders/${folderId}`);
    return this.reducer(resp);
  }

  /**
   * Add photos to folder
   * @param {*} folderId
   * @param {*} photoIds
   */
  async addPhotosToFolder(folderId, photoIds) {
    const resp = await this.post(`internal/portfolios/folders/${folderId}/addPhotos?ids=${photoIds.join()}`);
    return this.reducer(resp);
  }

  /**
   * Reorder photo in folder.
   * @param {*} folderId
   * @param {*} photoId
   * @param {*} afterId
   */
  async reorderPhotoInFolder(folderId, photoId, afterId=null) {
    const resp = await this.patch(`internal/portfolios/folders/${folderId}/reorder?photoId=${photoId}${afterId ? `&afterId=${afterId}` : ''}`);
    return this.reducer(resp);
  }

  /**
   * Remove folder in photo
   * @param {*} folderId
   * @param {*} photoIds
   */
  async removePhotosFromFolder(folderId, photoIds) {
    const resp = await this.delete(`internal/portfolios/folders/${folderId}/delete?ids=${photoIds.join(',')}`);
    return this.reducer(resp);
  }

  /**
   * Get a list of folders by photo IDs
   * @param {string[]} photoIds
   */
  async getByPhotoIds(photoIds) {
    const resp = await this.get(`internal/portfolios/folders/me/getByPhotoIds?photoIds=${photoIds.join(',')}`);
    return Object.values(resp.folders).map((folder) => this.reducer(folder));
  }

  /**
   * Bulk load data.
   * @param {*} keys
   */
  async bulkLoadData(keys) {
    const {folders} = await this.get(`internal/portfolios/folders/getByIds`, this.tidyQuery({ids: keys}));
    return keys.map((key) => folders[key]);
  }
};
