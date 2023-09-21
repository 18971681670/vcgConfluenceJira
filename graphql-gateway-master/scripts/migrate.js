import {PersonalAndProfile} from '../src/data_sources/user_profile/personal_and_profile';
import {SocialMedia} from '../src/data_sources/user_profile/social_media';
import {Portfolio} from '../src/data_sources/portfolios/portfolio';

/**
 * Pass list of portfolios to be backfilled
 * @param ...portfolioIds: List of the portfolio ids to be backfilled
 */
async function backfillOldPortfolios(...portfolioIds) {

  for (const portfolioId of portfolioIds.flat()) {
    const portfolio = new Portfolio();
    portfolio.initialize({context: {
      requestHeaders: {'x-500px-user-id': portfolioId},
      currentUserId: portfolioId}});

    const currentPortfolioContent = await portfolio.findByInternalId(portfolioId);
    if (currentPortfolioContent===null) {
      console.log(' No such portfolio ='+ portfolioId);
      break;
    }

    const currentEmail = currentPortfolioContent.email;
    const locationVisibility = currentPortfolioContent.visibilityOptions.location;
    const facebookVisibility = currentPortfolioContent.visibilityOptions.facebook;
    const instagramVisibility = currentPortfolioContent.visibilityOptions.instagram;
    const twitterVisibility = currentPortfolioContent.visibilityOptions.twitter;
    const currentCity = currentPortfolioContent.location.city;
    const currentCountry = currentPortfolioContent.location.country;
    const currentFacebook = currentPortfolioContent.socialMedia.facebook;
    const currentTwitter = currentPortfolioContent.socialMedia.twitter;
    const currentInstagram = currentPortfolioContent.socialMedia.instagram;

    let emailProfile = {};
    let socialMediaProfile = {};

    if (currentEmail===null || currentEmail===undefined || (locationVisibility == 'VISIBLE'&& (currentCity===null || currentCountry===null))) {
      const personalAndProfile = new PersonalAndProfile();
      personalAndProfile.initialize({context: {
        requestHeaders: {},
        currentUserId: portfolioId}});
      emailProfile = await personalAndProfile.loadData(portfolioId);
    }

    if ((facebookVisibility == 'VISIBLE' && currentFacebook ===null) || (instagramVisibility == 'VISIBLE' && currentInstagram ===null) ||
            (twitterVisibility == 'VISIBLE' && currentTwitter ===null)) {
      const socialMedia = new SocialMedia();
      socialMedia.initialize({context: {
        requestHeaders: {},
        currentUserId: portfolioId}});
      socialMediaProfile = await socialMedia.loadData(portfolioId);
    }

    let updatedBody = {};
    if (currentEmail===null) {
      updatedBody = {
        ...updatedBody,
        email: emailProfile.email,
      };
    }

    if (locationVisibility == 'VISIBLE'&& currentCity===null && emailProfile.city) {
      if (updatedBody.location!==undefined) {
        updatedBody['location']['city'] = emailProfile.city;
      } else {
        updatedBody = {
          ...updatedBody,
          location: {city: emailProfile.city},
        };
      }
    }
    if (locationVisibility == 'VISIBLE'&& currentCountry===null && emailProfile.country) {
      if (updatedBody.location!==undefined) {
        updatedBody['location']['country'] = emailProfile.country;
      } else {
        updatedBody = {
          ...updatedBody,
          location: {country: emailProfile.country},
        };
      }
    }

    if (facebookVisibility == 'VISIBLE' && currentFacebook ===null && socialMediaProfile.facebook) {
      if (updatedBody.socialMedia!==undefined) {
        updatedBody['socialMedia']['facebook'] = socialMediaProfile.facebook;
      } else {
        updatedBody = {
          ...updatedBody,
          socialMedia: {facebook: socialMediaProfile.facebook},
        };
      }
    }
    if (instagramVisibility == 'VISIBLE' && currentInstagram ===null && socialMediaProfile.instagram) {
      if (updatedBody.socialMedia!==undefined) {
        updatedBody['socialMedia']['instagram'] = socialMediaProfile.instagram;
      } else {
        updatedBody = {
          ...updatedBody,
          socialMedia: {instagram: socialMediaProfile.instagram},
        };
      }
    }
    if (twitterVisibility == 'VISIBLE' && currentTwitter ===null && socialMediaProfile.twitter) {
      if (updatedBody.socialMedia!==undefined) {
        updatedBody['socialMedia']['twitter'] = socialMediaProfile.twitter;
      } else {
        updatedBody = {
          ...updatedBody,
          socialMedia: {twitter: socialMediaProfile.twitter},
        };
      }
    }

    try {
      const updatedPortfolio =await portfolio.update(portfolioId, updatedBody);
       if (updatedPortfolio===null) {
            console.log(' Portfolio update did not succeed for ='+ portfolioId);
          }
    } catch (error) {
      console.log('Migrating for portfolio id '+portfolioId+' failed with error ' + error);
    }
  }
}

/**
 * Make a GET request to fetch the portfolio Ids
 * @param path is the GET endpoint for getting portfolioIds
 */
async function httpGetRequest(path) {
const express = require("express");
const axios = require("axios");
const router = express.Router();

const response = await axios.get(path, {
  headers: {
    'x-500px-user-id': '1'
  }
});
return response.data.portfolioIds
}

(async () => {
    const endpoint = 'http://172.17.0.1:8080/internal/portfolios/getAllIds'
    const response = await httpGetRequest(endpoint)
    backfillOldPortfolios(response);
})();
