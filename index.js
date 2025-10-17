const API_URL = "https://api.auto.dev/vin/WP0AF2A99KS165242?apiKey=sk_ad_K_76uHbkfaZfYKoQ5lH6YDjF";

async function handleSearch() {
  const input = document.getElementById("search__input").value.trim();
  const spinner = document.querySelector(".spinner-icon");
  const searchIcon = document.querySelector(".search-icon");

  // Show spinner, hide search icon
  spinner.style.display = "inline-block";
  searchIcon.style.display = "none";

  try {
    const response = await fetch(`${API_URL}?query=${encodeURIComponent(input)}`);
    if (!response.ok) throw new Error("Failed to fetch listings");

    const data = await response.json();
    console.log("Listings:", data);

    // Show the data on the page (you can customize this)
    displayListings(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    alert("There was an error fetching the car listings.");
  } finally {
    // Hide spinner, show search icon
    spinner.style.display = "none";
    searchIcon.style.display = "inline-block";
  }
}

function displayListings(data) {
  let resultsSection = document.getElementById("results");

  // If it doesn't exist, create it
  if (!resultsSection) {
    resultsSection = document.createElement("section");
    resultsSection.id = "results";
    resultsSection.style.padding = "2rem";
    document.body.appendChild(resultsSection);
  }

  // Clear previous results
  resultsSection.innerHTML = "";

  if (!data || !data.listings || data.listings.length === 0) {
    resultsSection.innerHTML = "<p>No cars found. Try a different search.</p>";
    return;
  }

  data.listings.forEach((car) => {
    const carCard = document.createElement("div");
    carCard.className = "car-card";
    carCard.style.border = "1px solid #ccc";
    carCard.style.padding = "1rem";
    carCard.style.margin = "1rem 0";
    carCard.style.borderRadius = "8px";
    carCard.style.boxShadow = "0 0 10px rgba(0,0,0,0.1)";

    carCard.innerHTML = `
      <h3>${car.year} ${car.make} ${car.model}</h3>
      <p>Price: $${car.price}</p>
      <p>Year: ${car.year}</p>
      ${car.media && car.media.photo_links.length > 0 ? `<img src="${car.media.photo_links[0]}" alt="${car.make} ${car.model}" style="max-width: 300px;" />` : ""}
    `;

    resultsSection.appendChild(carCard);
  });
}