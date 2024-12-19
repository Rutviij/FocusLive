const usageList = document.getElementById("usage-list");
const quoteElement = document.getElementById("quote");
const refreshButton = document.getElementById("refresh");
const productiveSitesInput = document.getElementById("productive-sites");
const saveSettingsButton = document.getElementById("save-settings");

let productiveSites = [];

// Load usage data and settings
chrome.storage.local.get(["usageData", "productiveSites"], (data) => {
  if (data.usageData) {
    displayUsage(data.usageData);
  }
  if (data.productiveSites) {
    productiveSites = data.productiveSites;
    productiveSitesInput.value = productiveSites.join(", ");
  }
});

// Display usage stats
function displayUsage(data) {
  usageList.innerHTML = "";
  for (const [domain, time] of Object.entries(data)) {
    const li = document.createElement("li");
    li.textContent = `${domain}: ${formatTime(time)} (${isProductive(domain) ? "Productive" : "Unproductive"})`;
    usageList.appendChild(li);
  }
}

// Check if a site is productive
function isProductive(domain) {
  return productiveSites.some((site) => domain.includes(site));
}

// Format time in seconds
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  return hours > 0 ? `${hours}h ${minutes % 60}m` : `${minutes}m ${seconds % 60}s`;
}

// Load a new motivational quote
function loadQuote() {
  const quotes = [
    "Stay focused and keep pushing forward.",
    "Success is the sum of small efforts repeated daily.",
    "Discipline is the bridge between goals and accomplishment.",
    "Your future self is watching. Make them proud.",
    "Focus on being productive, not busy."
  ];
  const randomIndex = Math.floor(Math.random() * quotes.length);
  quoteElement.textContent = quotes[randomIndex];
}

// Save productive sites
saveSettingsButton.addEventListener("click", () => {
  productiveSites = productiveSitesInput.value.split(",").map((site) => site.trim());
  chrome.storage.local.set({ productiveSites });
  alert("Settings saved!");
});

// Refresh quote
refreshButton.addEventListener("click", loadQuote);

// Load initial quote
loadQuote();
