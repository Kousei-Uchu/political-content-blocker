// Load the toxicity model (for text)
toxicity.load().then(model => {
  const elements = document.querySelectorAll("p, span, div");
  elements.forEach(el => {
    model.classify(el.innerText).then(predictions => {
      const isPolitical = predictions.some(p => p.results[0].match);
      if (isPolitical) {
        el.style.display = "none";
      }
    });
  });
});

// Load the NSFWJS model (for images)
nsfwjs.load().then(model => {
  const images = document.querySelectorAll("img");
  images.forEach(img => {
    model.classify(img).then(predictions => {
      const isPoliticalImage = predictions.some(p => p.className === "Political" && p.probability > 0.7);
      if (isPoliticalImage) {
        img.style.display = "none";
      }
    });
  });
});
