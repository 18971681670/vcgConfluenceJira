import {Location} from '../src/data_sources/location/location';
import {HireLocation} from '../src/data_sources/hire_location/hire_location';

const express = require("express");
const axios = require("axios");
const router = express.Router();

/**
 * Pass list of photographers whose hire locations need to be backfilled
 * @param ...photographers: List of photographers
 */
async function backfillHireLocations(photographers) {

for (const photographer of photographers.data) {

    if(photographer.location_id !== null) {
    // get location data according to user id
    const location= new Location();
    location.initialize({context: {
      requestHeaders: {'x-500px-user-id': photographer.user_id},
      currentUserId: photographer.user_id}});

    let locationResponse = {};
    try {
        locationResponse = await location.findByInternalId(photographer.location_id);
    } catch (e) {
        console.log('error in location response');
    }
    const locationData = {
        latitude: locationResponse.latitude,
        longitude: locationResponse.longitude,
        city: locationResponse.locality,
        administrativeZone1: locationResponse.administrativeArea1,
        country: locationResponse.country,
        displayName: locationResponse.formattedAddress,
    };

    const hireLocation = new HireLocation();
    hireLocation.initialize({context: {
          requestHeaders: {'x-500px-user-id': photographer.user_id},
          currentUserId: photographer.user_id}});

            try {
                  const hireLocationsResponse = await hireLocation.update(photographer.user_id,[locationData]);
                  if (hireLocationsResponse===null) {
                               console.log(' Hire Location update did not succeed for ='+ photographer.user_id);
                  }
                 } catch (e) {
                   console.log(e.response);
                   console.log("Error updating photographer profile for "+ photographer.user_id);
                    throw e;
                 }
}
}
}
/**
 * Make a GET request to fetch the portfolio Ids
 * @param path is the GET endpoint for getting portfolioIds
 */
async function httpGetRequest(path, paramName, paramValue) {

let response;
if(paramName===undefined){
 response = await axios.get(path, {
  headers: {
    'x-500px-user-id': '1'
  }
});
} else {
const params = {};
params[paramName] = paramValue;

response = await axios.get(path, {
  headers: {
    'x-500px-user-id': '1'
  },
  params: params,
});
}

return response
}

(async () => {
    const batchSize = 1000;
    const endpoint = 'http://172.17.0.1:8081/internal/resume/photographers';
    const paramName = 'seed';

    // limit value entered and updated depending on the number of photographers
    for (let index = 0; index <= limit; index= parseInt(index)+parseInt(batchSize) ) {
         const photographerResponse = await httpGetRequest(endpoint,paramName,index);
         const nextIndex = parseInt(index)+parseInt(batchSize);
               try {
                 // backfillHireLocations(photographerResponse);
                  console.log(" Succesfully updated photographer profiles from "+ index+ " to "+ nextIndex);
                 } catch (e) {
                   console.log(e.response);
                   console.log("Error updating photographer profiles from "+ index+ " to "+ nextIndex);
                   throw e;
                 }
        }
})();