
const API_KEY = "326d2be7";
const API_URL = `https://www.omdbapi.com/?apikey=${API_KEY}`;

let allMovies = [];

window.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search__input");
  const searchButton = document.getElementById("search__btn");

  // Default fetch for background activity (optional)
  if (searchInput) fetchMovies("Good");

  //  Handle Search button click
  if (searchButton) {
    searchButton.addEventListener("click", handleSearch);
  }

  //  Handle "Enter" key
  if (searchInput) {
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSearch();
      }
    });
  }
});

// Fetch movies (optional: preload visual)
async function fetchMovies(searchTerm) {
  const loading = document.getElementById("watchMovie");
  if (loading) loading.classList.add("loading");

  try {
    const response = await fetch(`${API_URL}&s=${encodeURIComponent(searchTerm)}`);
    const data = await response.json();

    if (data.Response === "True" && data.Search.length > 0) {
      allMovies = data.Search;
      console.log("Fetched:", allMovies);
      showSuccessAnimation();
    } else {
      showError("No movies found.");
    }
  } catch (error) {
    console.error("Fetch error:", error);
    showError("Failed to load movies. Please try again.");
  } finally {
    if (loading) loading.classList.remove("loading");
  }
}

//  Handle actual search (both button + Enter)
function handleSearch() {
  const searchInput = document.getElementById("search__input");
  const query = searchInput ? searchInput.value.trim() : "";

  if (!query) {
    alert("Please enter a movie name to search!");
    return;
  }

  // Redirect to movies page with query string
  window.location.href = `movies.html?search=${encodeURIComponent(query)}`;
}

//  Visual feedback (optional)
function showSuccessAnimation() {
  const watchMovie = document.getElementById("watchMovie");
  if (!watchMovie) return;
  watchMovie.classList.add("success");
  setTimeout(() => watchMovie.classList.remove("success"), 800);
}

//  Simple error display
function showError(message) {
  const watchMovie = document.getElementById("watchMovie");
  if (watchMovie) {
    watchMovie.innerHTML = `<p style="text-align:center; color:#6030b1;">${message}</p>`;
    setTimeout(() => {
      watchMovie.innerHTML = `
        <img class="movie movie1" src="./assets/undraw_home-cinema_jdm1.svg" alt="" />
        <div class="loading__dots"><div class="bento-menu__dot loading__dot movie1"></div></div>
      `;
    }, 2000);
  }
}

// --- MOBILE MENU TOGGLE ---
function toggleMenu() {
  const menu = document.querySelector(".show__menu");
  const bento = document.querySelector(".bento-menu");
  if (!menu || !bento) return;
  menu.classList.toggle("active");
  bento.classList.toggle("active");
}
