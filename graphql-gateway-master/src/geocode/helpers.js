import {reverseGeocodeQuery, reverseGeocodeRangeQuery} from './db';
import {findClosestCity} from './haversine';

export const reverseGeocode = (latitude, longitude) => {
  let city = null;
  let admin1 = null;
  let country = null;

  const exactMatch = reverseGeocodeQuery(latitude, longitude);
  if (exactMatch) {
    city = exactMatch.name;
    admin1 = exactMatch.admin1;
    country = exactMatch.country;
  } else {
    const rangeMatch = reverseGeocodeRangeQuery(latitude, longitude, 0.1);
    if (rangeMatch.length > 0) {
      const closestCity = findClosestCity(latitude, longitude, rangeMatch);
      if (!!closestCity) {
        city = closestCity.name;
        admin1 = closestCity.admin1;
        country = closestCity.country;
      } else {
        city = rangeMatch[0].name;
        admin1 = rangeMatch[0].admin1;
        country = rangeMatch[0].country;
      }
    }
  }

  return {
    city,
    admin1,
    country,
  };
};

// Array of objects with latitude/longitude fields
export const reverseGeocodes = (coordinates) => {
  return coordinates.map((coordinate) => {
    const {latitude, longitude} = coordinate;
    return reverseGeocode(latitude, longitude);
  });
};

export const buildHireLocationsResponse = (hireLocations) => {
  const coordinates = hireLocations.map((location) => ({
    latitude: location.latitude,
    longitude: location.longitude,
  }));

  const citiesRegionsCountries = reverseGeocodes(coordinates);
  const hireLocationsResponse = hireLocations.map((hireLocation, index) => {
    const {city, admin1, country} = citiesRegionsCountries[index];
    return {
      ...hireLocation,
      city,
      admin1,
      country,
    };
  });
  return hireLocationsResponse;
};
