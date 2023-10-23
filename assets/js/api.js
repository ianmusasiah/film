'use strict';

const api_key = '2051710e2b77f17652a595dbc3a52425';
const imageBaseURL = 'https://image.tmdb.org/t/p/';

/**
 * fetch data from a server using the `url` and passes
 * the result in JSON data to a `callback` function,
 * along with an optional parameter if it has `optionalParam`.
 */

const fetchDataFromServer = function (url, callback, optionalParam) {
  fetch(url)
    .then(response => response.json())
    .then(data => {
      // Filter out restricted content, movies with undefined ratings, no poster, and movies rated under 5.0
      const filteredData = filterMovies(data);
      callback(filteredData, optionalParam);
    });
}

/**
 * Filter movies based on restrictions, undefined ratings, missing posters, and ratings under 5.0
 */
function filterMovies(data) {
  if (data.results && Array.isArray(data.results)) {
    // Filter movies based on the provided keywords, undefined ratings, no poster, and ratings under 5.0
    const filteredResults = data.results.filter(movie => {
      const { overview, vote_average, poster_path } = movie;
      return !containsRestrictedContent(overview) && isDefinedRating(vote_average) && hasPoster(poster_path) && isRatedAbove5(vote_average);
    });

    // Update the results with filtered data
    data.results = filteredResults;
  }

  return data;
}

/**
 * Check if content contains restricted keywords.
 */
function containsRestrictedContent(overview) {
  const restrictedKeywords = [
    'NC-17',
    /* "X" */,
    "Adult",
    "sex",
    'nudity',
    'nude',
    // ... add more keywords ...
  ];

  return restrictedKeywords.some(keyword => new RegExp(keyword, 'i').test(overview));
}

/**
 * Check if the rating is defined (not equal to 0.0).
 */
function isDefinedRating(vote_average) {
  return vote_average !== 0.0;

}

/**
 * Check if the movie has a poster.
 */
function hasPoster(poster_path) {
  return poster_path !== null && poster_path !== undefined;
}

/**
 * Check if the rating is above 5.0.
 */
function isRatedAbove5(vote_average) {
  return vote_average > 5.0;
}

export { imageBaseURL, api_key, fetchDataFromServer };
