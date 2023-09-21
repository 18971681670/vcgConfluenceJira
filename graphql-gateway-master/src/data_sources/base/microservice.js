import {DataSource} from 'apollo-datasource';

/**
 * A wrapper for all data sources under a microservce
 */
export class Microservice extends DataSource {
  /**
   * Constructor
   * @param {Object<DataSource>} dataSources A map of DataSource objects
   */
  constructor(dataSources) {
    super();

    this.dataSources = dataSources;
  }

  /**
   * Setup all data sources under this microservice
   * @param {DataSourceConfig} config Apollo DataSource config
   */
  initialize(config = {}) {
    const extendedConfig = {
      ...config,
      microserviceDataSource: this, // to allow accessing sibling datasources from the same microservice.
    };

    for (const [name, ds] of Object.entries(this.dataSources)) {
      ds.initialize(extendedConfig);

      // Expose this datasource as a property
      this[name] = ds;
    }
  }
}
