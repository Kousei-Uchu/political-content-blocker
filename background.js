importScripts("tf.min.js", "toxicity.min.js");

let model = null;
const threshold = 0.8;

toxicity.load(threshold).then(m => {
  model = m;
  console.log("✅ Toxicity model loaded");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "analyzeText" && model) {
    model.classify([message.text]).then(predictions => {
      const toxic = predictions.some(p =>
        p.label === "toxicity" &&
        p.results[0].probabilities[1] > threshold
      );
      sendResponse({ toxic });
    });
    return true; // Keep async response channel open
  }
});

