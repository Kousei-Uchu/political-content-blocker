// background.js

let model = null;
const threshold = 0.8;

// Load the toxicity model when the service worker is started
chrome.runtime.onInstalled.addListener(() => {
  toxicity.load(threshold).then(m => {
    model = m;
    console.log("✅ Toxicity model loaded");
  });
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "analyzeText" && model) {
    model.classify([message.text]).then(predictions => {
      const toxic = predictions.some(p =>
        p.label === "toxicity" &&
        p.results[0].probabilities[1] > threshold
      );
      sendResponse({ toxic });
    });
    return true; // Keep the response channel open for async handling
  }
});
