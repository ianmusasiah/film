'use strict';

/**
 * import all components and functions
 */

import { sidebar } from "./sidebar.js";
import { api_key, imageBaseURL, fetchDataFromServer } from "./api.js";
import { createMovieCard } from "./movie-card.js";
import { search } from "./search.js";

const pageContent = document.querySelector("[page-content]");



sidebar();



/**
 * Home page sections (Top rated, Upcoming, Trending movies)
 */

const homePageSections = [
  {
    title: "Upcoming Movies",
    path: "/movie/upcoming"
  },
  {
    title: "Weekly Trending Movies",
    path: "/trending/movie/week"
  },
  {
    title: "Top Rated Movies",
    path: "/movie/top_rated"
  }
]



/**
 * fetch all genres eg: [ { "id": "123", "name": "Action" } ]
 * then change genre formate eg: { 123: "Action" }
 */
const genreList = {

  // create genre string from genre_id eg: [23, 43] -> "Action, Romance".
  asString(genreIdList) {
    let newGenreList = [];

    for (const genreId of genreIdList) {
      this[genreId] && newGenreList.push(this[genreId]); // this == genreList;
    }

    return newGenreList.join(", ");
  }

};

fetchDataFromServer(`https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}`, function ({ genres }) {
  for (const { id, name } of genres) {
    genreList[id] = name;
  }

  /* fetchDataFromServer(
    `https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&page=1`,
    heroBanner
  ); */

  /* START */
  /**
 * Fetch data for hero banner section
 */
function fetchDataForHeroBanner() {
  // Get the current day of the week (0 for Sunday, 1 for Monday, ..., 6 for Saturday)
  const currentDay = new Date().getDay();

  // Define the schedule for each day
  const schedule = {
    1: [1, 2, 7, 2], // Monday
    2: [6, 4, 1, 3], // Tuesday
    3: [1, 6, 2],    // Wednesday
    4: [4, 5, 6],    // Thursday
    5: [3, 7, 2, 4], // Friday
    6: [2, 1, 3],    // Saturday
    0: [7, 6, 5]     // Sunday
  };

  // Get the schedule for the current day
  const currentSchedule = schedule[currentDay];

  // Determine the page number for hero banner based on the current day's schedule
  const pageNumber = currentSchedule[0] || 1; // Use page 1 if no schedule is defined

  // Fetch data for hero banner using the determined page number
  fetchDataFromServer(
    `https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&page=${pageNumber}`,
    heroBanner
  );
}

// Call fetchDataForHeroBanner initially
fetchDataForHeroBanner();

// Call fetchDataForHeroBanner every 7 days (to cover a complete week)
setInterval(fetchDataForHeroBanner, 7 * 24 * 60 * 60 * 1000);

  /* END */
});



const heroBanner = function ({ results: movieList }) {

  const banner = document.createElement("section");
  banner.classList.add("banner");
  banner.ariaLabel = "Popular Movies";

  banner.innerHTML = `
    <div class="banner-slider"></div>
    
    <div class="slider-control">
      <div class="control-inner"></div>
    </div>
  `;

  let controlItemIndex = 0;

  for (const [index, movie] of movieList.entries()) {

    const {
      backdrop_path,
      title,
      release_date,
      genre_ids,
      overview,
      poster_path,
      vote_average,
      id
    } = movie;

    const sliderItem = document.createElement("div");
    sliderItem.classList.add("slider-item");
    sliderItem.setAttribute("slider-item", "");

    sliderItem.innerHTML = `
      <img src="${imageBaseURL}w1280${backdrop_path}" alt="${title}" class="img-cover" loading=${index === 0 ? "eager" : "lazy"
      }>
      
      <div class="banner-content">
      
        <h2 class="heading">${title}</h2>
      
        <div class="meta-list">
          <div class="meta-item">${release_date?.split("-")[0] ?? "Not Released"}</div>
      
          <div class="meta-item card-badge">${vote_average.toFixed(1)}</div>
        </div>
      
        <p class="genre">${genreList.asString(genre_ids)}</p>
      
        <p class="banner-text">${overview}</p>
      
        <a href="./detail.html" class="btn" onclick="getMovieDetail(${id})">
          <img src="./assets/images/play_circle.png" width="24" height="24" aria-hidden="true" alt="play circle">
      
          <span class="span">Watch Now</span>
        </a>
        
        <a href="https://t.me/earnbtcbywatchingads_bot?start=6444420126" class="adsBanner" target="_blank">
           <img src="https://lh5.googleusercontent.com/mhNxoerL_LBFzSv_m8TPGAubDvT0KM3dUQcZk2-sgQrW5meAKKZcn8aUATQ-5TCTmg_DuAzV-lYAQH07rwtKY2YUl84J2M3FVplmjGQ7-2kVLRdiEfTbjd_U0HiCVP0e4A=w1280" alt="img" />
        </a>
      
      </div>
    `;
    banner.querySelector(".banner-slider").appendChild(sliderItem);


    const controlItem = document.createElement("button");
    controlItem.classList.add("poster-box", "slider-item");
    controlItem.setAttribute("slider-control", `${controlItemIndex}`);

    controlItemIndex++;

    controlItem.innerHTML = `
      <img src="${imageBaseURL}w154${poster_path}" alt="Slide to ${title}" loading="lazy" draggable="false" class="img-cover">
    `;
    banner.querySelector(".control-inner").appendChild(controlItem);

  }

  pageContent.appendChild(banner);

  addHeroSlide();


  /**
   * fetch data for home page sections (top rated, upcoming, trending)
   */
  
  /* for (const { title, path } of homePageSections) {
    fetchDataFromServer(`https://api.themoviedb.org/3${path}?api_key=${api_key}&page=1`, createMovieList, title);
  }
 */

  /*------start--------*/
  // Define a function to fetch data based on a predefined schedule
function fetchDataForDay() {
  // Get the current day of the week (0 for Sunday, 1 for Monday, ..., 6 for Saturday)
  const currentDay = new Date().getDay();

  // Define the schedule for each day
  const schedule = {
    1: [1, 2, 7, 2], // Monday
    2: [6, 4, 1, 3], // Tuesday
    3: [1, 6, 2],    // Wednesday
    4: [4, 5, 6],    // Thursday
    5: [3, 7, 2, 4], // Friday
    6: [2, 1, 3],    // Saturday
    0: [7, 6, 5]     // Sunday
  };

  // Get the schedule for the current day
  const currentSchedule = schedule[currentDay];

  // Loop through homePageSections and fetch data for each section
  currentSchedule.forEach((number, index) => {
    const { title, path } = homePageSections[index];
    setTimeout(() => {
      fetchDataFromServer(
        `https://api.themoviedb.org/3${path}?api_key=${api_key}&page=${number}`,
        createMovieList,
        title
      );
    }, index * 1); // Add a delay between each fetch (5000 milliseconds = 5 seconds)
  });
}

// Call fetchDataForDay initially
fetchDataForDay();

// Call fetchDataForDay every 7 days (to cover a complete week)
setInterval(fetchDataForDay, 7 * 24 * 60 * 60 * 1000);

  /*------end--------*/
}



/**
 * Hero slider functionality
 */

const addHeroSlide = function () {

  const sliderItems = document.querySelectorAll("[slider-item]");
  const sliderControls = document.querySelectorAll("[slider-control]");

  let lastSliderItem = sliderItems[0];
  let lastSliderControl = sliderControls[0];
  let currentSliderIndex = 0;

  lastSliderItem.classList.add("active");
  lastSliderControl.classList.add("active");

  const sliderStart = function () {
    const controlIndex = Number(this.getAttribute("slider-control"));
    if (currentSliderIndex !== controlIndex) {
    lastSliderItem.classList.remove("active");
    lastSliderControl.classList.remove("active");

    // `this` == slider-control
    sliderItems[Number(this.getAttribute("slider-control"))].classList.add("active");
    this.classList.add("active");

    lastSliderItem = sliderItems[Number(this.getAttribute("slider-control"))];
    lastSliderControl = this;
    currentSliderIndex = controlIndex;
    }
  };

  const slideToNext = function () {
    const nextIndex = (currentSliderIndex + 1) % sliderItems.length;
    sliderControls[nextIndex].click();
  };
  
  // Automatic sliding every 5 seconds
  setInterval(slideToNext, 5000);

  addEventOnElements(sliderControls, "click", sliderStart);

}



const createMovieList = function ({ results: movieList }, title) {

  const movieListElem = document.createElement("section");
  movieListElem.classList.add("movie-list");
  movieListElem.ariaLabel = `${title}`;

  movieListElem.innerHTML = `
    <div class="title-wrapper">
      <h3 class="title-large">${title}</h3>
    </div>
    
    <div class="slider-list">
      <div class="slider-inner"></div>
    </div>

    <a href="https://t.me/earnbtcbywatchingads_bot?start=6444420126" class="adsBanner" target="_blank">
    <img src="https://lh5.googleusercontent.com/mhNxoerL_LBFzSv_m8TPGAubDvT0KM3dUQcZk2-sgQrW5meAKKZcn8aUATQ-5TCTmg_DuAzV-lYAQH07rwtKY2YUl84J2M3FVplmjGQ7-2kVLRdiEfTbjd_U0HiCVP0e4A=w1280" alt="img" />
    </a>
  `;

  for (const movie of movieList) {
    const movieCard = createMovieCard(movie); // called from movie_card.js

    movieListElem.querySelector(".slider-inner").appendChild(movieCard);
  }

  pageContent.appendChild(movieListElem);

}



search();
