
const API_KEY = "326d2be7";
const API_URL = `https://www.omdbapi.com/?apikey=${API_KEY}`;

let allMovies = []; // store fetched movies for filtering

// Initial load
window.addEventListener("DOMContentLoaded", () => {
  fetchMovies("Good"); // default search
  setupYearSlider();
  setupSearchHandlers();
});

// Fetch movies from OMDb
async function fetchMovies(searchTerm) {
  const movieContainer = document.getElementById("movie-container");
  const loading = document.getElementById("watchMovie");
  movieContainer.innerHTML = "";

  loading.classList.add("loading");

  try {
    const response = await fetch(`${API_URL}&s=${encodeURIComponent(searchTerm)}`);
    const data = await response.json();

    if (data.Response === "True" && data.Search.length > 0) {
      allMovies = data.Search; // store all fetched movies
      renderMovies(allMovies.slice(0, 6)); // show first 6 results
    } else {
      movieContainer.innerHTML = `<p style="text-align:center; color:#6030b1; font-size:20px;">No movies found.</p>`;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    movieContainer.innerHTML = `<p style="text-align:center; color:red;">Failed to load movies. Please try again.</p>`;
  } finally {
    loading.classList.remove("loading");
  }
}

// Render a list of movies into the container
function renderMovies(movies) {
  const movieContainer = document.getElementById("movie-container");
  const template = document.getElementById("movies__template");
  movieContainer.innerHTML = "";

  movies.forEach(movie => {
    const movieElement = template.cloneNode(true);
    movieElement.style.display = "block";

    movieElement.querySelector(".movie__poster").src =
      movie.Poster !== "N/A" ? movie.Poster : "./assets/placeholder.png";
    movieElement.querySelector(".movie__title").textContent = movie.Title;
    movieElement.querySelector(".movie__year").textContent = `Year: ${movie.Year}`;
    movieElement.querySelector(".movie__imdbID").textContent = `IMDb ID: ${movie.imdbID}`;

    movieContainer.appendChild(movieElement);
  });
}

// --- HANDLE SEARCH ---
function handleSearch() {
  const searchInput = document.getElementById("search__input");
  const query = searchInput.value.trim();
  if (query) {
    fetchMovies(query);
  } else {
    alert("Please enter a movie name to search!");
  }
}

// Add event listeners for click + Enter key
function setupSearchHandlers() {
  const searchButton = document.querySelector(".search__btn--wrapper");
  const searchInput = document.getElementById("search__input");

  // Trigger on click
  searchButton.addEventListener("click", handleSearch);

  // Trigger on Enter key
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  });
}

// --- YEAR SLIDER FUNCTIONALITY ---
function setupYearSlider() {
  const minSlider = document.getElementById("minSlider");
  const maxSlider = document.getElementById("maxSlider");
  const minValLabel = document.getElementById("minVal");
  const maxValLabel = document.getElementById("maxVal");
  const sliderBar = document.getElementById("sliderBar");
  const minHandle = document.getElementById("minHandle");
  const maxHandle = document.getElementById("maxHandle");

  let minVal = parseInt(minSlider.value);
  let maxVal = parseInt(maxSlider.value);

  function updateSliderUI() {
    const range = maxSlider.max - minSlider.min;
    const minPercent = ((minVal - minSlider.min) / range) * 100;
    const maxPercent = ((maxVal - minSlider.min) / range) * 100;

    sliderBar.style.left = `${minPercent}%`;
    sliderBar.style.width = `${maxPercent - minPercent}%`;
    minHandle.style.left = `${minPercent}%`;
    maxHandle.style.left = `${maxPercent}%`;
    minValLabel.textContent = minVal;
    maxValLabel.textContent = maxVal;
  }

  function filterMoviesByYear() {
    if (!allMovies.length) return;
    const filtered = allMovies.filter(movie => {
      const year = parseInt(movie.Year);
      return year >= minVal && year <= maxVal;
    });
    renderMovies(filtered.slice(0, 6));
  }

  minSlider.addEventListener("input", () => {
    minVal = Math.min(parseInt(minSlider.value), parseInt(maxSlider.value) - 1);
    updateSliderUI();
    filterMoviesByYear();
  });

  maxSlider.addEventListener("input", () => {
    maxVal = Math.max(parseInt(maxSlider.value), parseInt(minSlider.value) + 1);
    updateSliderUI();
    filterMoviesByYear();
  });

  updateSliderUI();
}

// --- MOBILE MENU TOGGLE ---
function toggleMenu() {
  const menu = document.querySelector(".show__menu");
  const bento = document.querySelector(".bento-menu");
  menu.classList.toggle("active");
  bento.classList.toggle("active");
}

