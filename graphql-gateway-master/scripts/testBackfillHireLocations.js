import {Location} from '../src/data_sources/location/location';
import {HireLocation} from '../src/data_sources/hire_location/hire_location';
import {Client} from "@googlemaps/google-maps-services-js";

const express = require("express");
const axios = require("axios");
const router = express.Router();
const API_KEY = 'AIzaSyA1vLloHGsSD5p8Y4-NBhGPa1T_mZz11KU';
const mysql = require('mysql');
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'rds-user.j79-dev.500px.net',
    user: 'nNZ1S87MQv4',
    password: 'lt0v067-mkZnTKyMv-FNKSx7J0xAYsSX',
    database: 'user'
});

/**
 * TEST Script with mock tables tmp_photographers and tmp_hire_locations
 * Pass list of photographers whose hire locations need to be backfilled
 * @param ...photographers: List of photographers
 */
async function backfillHireLocations(photographers) {

console.log("inside backfill");
const client = new Client({});
let ind=1;
for (const photographer of photographers) {
    if(ind===1) {
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

        // check if location data locality field is in english
//        if(locationResponse.locality.match('[A-Za-z -]+')) {
//                  // use below incase of prod db otherwise local db
//                  //return await hireLocation.update(photographer.user_id,[locationData]);
//                  console.log("inside locality match");
//        } else {
            let googleLocationData = {};
            console.log("inside no locality match");
           // first check if already present in hireLocation table
                  pool.query(' SELECT * from tmp_hire_locations_2', function (error, results, fields) {
                    if(error) throw error;
                           try {
                              console.log("typeof results = "+typeof results);
                              console.log(results);
//                              if(results.length===0) {
//                               console.log("calling google maps api");
//
////                                    client
//                                       .placeDetails({
//                                         params: {
//                                           place_id: locationResponse.placeId,
//                                           key: API_KEY,
//                                         },
//                                         timeout: 1000, // milliseconds
//                                       })
//                                       .then(async (r) => {
//                                        let city,country, administrativeZone1;
//                                         for(const o of r.data.result.address_components){
//                                            for(const x of o.types){
//                                                switch(x) {
//                                                    case 'locality':
//                                                        city = o.long_name;
//                                                        break;
//                                                    case 'country':
//                                                        country = o.long_name;
//                                                        break;
//                                                    case 'administrative_area_level_1':
//                                                        administrativeZone1 = o.long_name;
//                                                        break;
//                                                }
//                                            }
//                                         }
//                                        googleLocationData = {
//                                              latitude: r.data.result.geometry.location.lat,
//                                              longitude: r.data.result.geometry.location.lng,
//                                              city: city,
//                                              administrativeZone1: administrativeZone1,
//                                              country: country,
//                                              displayName: r.data.result.formatted_address,
//                                          };
//
//                                     return await hireLocation.update(photographer.user_id,[googleLocationData]);
//                                    });
//                              } else {
                                let query = 'SELECT * from hire_locations where round(latitude,1) = ' + locationResponse.latitude.toFixed(1)
                                  + ' and round(longitude,1) = ' + locationResponse.longitude.toFixed(1) + ' LIMIT 1';
                                  console.log('Query formed =' + query);
                                 pool.query(query, function (error, results, fields) {
                                    if(error) throw error;
                                    pool.query('insert into tmp_hire_locations_2 values('+results[0].user_id+', NULL,'+
                                    results[0].latitude+','+results[0].longitude+',\''+results[0].city+'\',''
                                    +results[0].administrative_zone1+'\'',''+results[0].country+'\'',''+results[0].display_name+'\')',
                                    function(error, results,fields){
                                    if(error) throw error;});
                                 });
                            //  }
                             } catch (e) {
                                console.log(e.response);
                                throw e;
                             }

                  });
        // }
    }
    }
ind++;
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
    console.log("inside start");
    const batchSize = 1000;
   // const endpoint = 'http://172.17.0.1:8081/internal/resume/photographers';
    const paramName = 'seed';
    console.log("starting for loop");

    // local db setup


    // Use the following for loop in prod env with total number of records minus 1000 as limit of for loop
  //  for (let index = 0; index <= 217940; index= parseInt(index)+parseInt(batchSize) ) {

      // use this get photographers when in prod environemnt
      // const photographerResponse = await httpGetRequest(endpoint,paramName,index);

     // const photographerResponse = [];
      pool.query(' SELECT * from tmp_photographers_2', function (error, results, fields) {
        if(error) throw error;
        // const nextIndex = parseInt(index)+parseInt(batchSize);
             // console.log(" Succesfully fetched photographer profiles from "+ index+ " to "+ nextIndex);
               try {
                  const hireLocationsResponse = backfillHireLocations(results);
                  if (hireLocationsResponse===null) {
                               console.log(' Hire Location update did not succeed for ='+ photographer.user_id);
                             }
               //   console.log(" Succesfully updated photographer profiles from "+ index+ " to "+ nextIndex);
                 } catch (e) {
                    console.log(e.response);
                 //  console.log("Error updating photographer profiles from "+ index+ " to "+ nextIndex);
                    throw e;
                 }

      });
})();