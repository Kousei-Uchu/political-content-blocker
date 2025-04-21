// background.js

let model = null;
const threshold = 0.8;

// Load the toxicity model
toxicity.load(threshold).then(m => {
  model = m;
  console.log("✅ Toxicity model loaded");
});

// Listen for requests from the content script
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
