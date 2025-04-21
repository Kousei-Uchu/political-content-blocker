function analyzeText(text, callback) {
  chrome.runtime.sendMessage({ type: "analyzeText", text }, response => {
    if (response && response.toxic) {
      callback(true);
    } else {
      callback(false);
    }
  });
}

function blockElement(el) {
  if (el && el.style) {
    el.style.display = "none";
    el.setAttribute("data-blocked", "true");
    console.log("🔕 Blocked toxic content:", el.innerText?.slice(0, 100) || "[element]");
  }
}

// Block text content
document.querySelectorAll("p, span, div, h1, h2, h3").forEach(el => {
  const text = el.innerText;
  if (text && text.length > 20) { // Avoid tiny snippets
    analyzeText(text, isToxic => {
      if (isToxic) {
        blockElement(el);
      }
    });
  }
});

// Block images based on toxic content
document.querySelectorAll("img").forEach(img => {
  if (img.src) {
    // Analyze image for political content (can be added in background.js if necessary)
    // Placeholder function for now
    img.style.display = "none"; // Hide toxic image (just an example)
    console.log("🔕 Blocked toxic image:", img.src);
  }
});
