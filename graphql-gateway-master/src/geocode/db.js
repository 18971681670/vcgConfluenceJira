/*
 *const path = require('path');
 *const Database = require('better-sqlite3');
 */

// Local path does not work
/*
 *const dbPath = path.resolve(__dirname, 'cities500.db');
 *const db = new Database(dbPath, {fileMustExist: true});
 */

/*
 *export const reverseGeocodeStatement = db.prepare(
 *    'SELECT name, admin1, country FROM geonames WHERE longitude = @longitude AND latitude = @latitude;',
 *);
 */

export const reverseGeocodeQuery = (latitude, longitude) => {
  // Returns `undefined` if no matches
  try {
    return reverseGeocodeStatement.get({
      longitude,
      latitude,
    });
  } catch (e) {
    return undefined;
  }
};

// coordinates is an array of objects with latitude and longitude fields
export const reverseGeocodesQuery = (coordinates) => {
  try {
    return coordinates.map((coordinate) => {
      const {latitude, longitude} = coordinate;
      return reverseGeocodeStatement.get({
        latitude,
        longitude,
      });
    });
  } catch (e) {
    return [];
  }
};

/*
 *export const reverseGeocodeRangeStatement = db.prepare(
 *    'SELECT name, admin1, country, latitude, longitude FROM geonames WHERE (longitude BETWEEN @longitudeMin AND @longitudeMax) AND (latitude BETWEEN @latitudeMin AND @latitudeMax) AND feature_code != \'PPLX\' LIMIT 20',
 *);
 */

export const reverseGeocodeRangeQuery = (latitude, longitude, range = 0.1) => {
  const latitudeMin = latitude - range;
  const latitudeMax = latitude + range;
  const longitudeMin = longitude - range;
  const longitudeMax = longitude + range;
  try {
    return reverseGeocodeRangeStatement.all({
      latitudeMin,
      latitudeMax,
      longitudeMin,
      longitudeMax,
    });
  } catch (e) {
    return [];
  }
};
