let activeTab = null;
let startTime = null;
let usageData = {};

// Function to calculate time spent
function trackTimeSpent() {
  if (activeTab && startTime) {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    const domain = new URL(activeTab).hostname;

    if (!usageData[domain]) {
      usageData[domain] = 0;
    }
    usageData[domain] += timeSpent;

    chrome.storage.local.set({ usageData });
    startTime = Date.now();
  }
}

// Listen for tab changes
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  trackTimeSpent();

  const tab = await chrome.tabs.get(activeInfo.tabId);
  activeTab = tab.url;
  startTime = Date.now();
});

// Listen for tab updates (e.g., navigation)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.active && changeInfo.url) {
    trackTimeSpent();
    activeTab = tab.url;
    startTime = Date.now();
  }
});

// Save data when the browser is closed
chrome.runtime.onSuspend.addListener(trackTimeSpent);
