function injectScript(fileUrl) {
  const script = document.createElement('script');
  script.src = fileUrl;
  script.type = 'text/javascript';
  script.async = false;
  script.onload = () => console.log(`✅ Injected ${fileUrl}`);
  document.documentElement.appendChild(script);
}

// Inject libraries into the page context (not content script context)
injectScript('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs');
injectScript('https://cdn.jsdelivr.net/npm/@tensorflow-models/toxicity@1.2.2/dist/toxicity.min.js');

// Inject our detection logic once libraries are loaded
const logicScript = document.createElement('script');
logicScript.textContent = `
  console.log("🚀 AI Political Blocker starting...");

  function waitForToxicityModel(callback) {
    if (typeof toxicity === 'undefined' || typeof tf === 'undefined') {
      console.log("⏳ Waiting for toxicity model...");
      return setTimeout(() => waitForToxicityModel(callback), 500);
    }
    callback();
  }

  waitForToxicityModel(() => {
    const threshold = 0.8;
    toxicity.load(threshold).then(model => {
      console.log("🔍 Toxicity model loaded!");

      function checkTextForToxicity(text) {
        return model.classify([text]).then(preds => {
          return preds.some(p =>
            p.label === "toxicity" &&
            p.results[0].probabilities[1] > threshold
          );
        });
      }

      function blockElement(el) {
        if (el && el.style && !el.dataset.blocked) {
          el.style.display = "none";
          el.dataset.blocked = "true";
          console.log("🔒 Blocked:", el.innerText?.slice(0, 80));
        }
      }

      const blocks = Array.from(document.querySelectorAll("p, span, div, h1, h2, h3"));
      blocks.forEach(el => {
        if (el.innerText && !el.dataset.blocked) {
          checkTextForToxicity(el.innerText).then(block => {
            if (block) blockElement(el.closest("article") || el.closest("div") || el);
          });
        }
      });

      const observer = new MutationObserver(muts => {
        muts.forEach(m => {
          m.addedNodes.forEach(n => {
            if (n.nodeType === Node.ELEMENT_NODE && n.innerText) {
              checkTextForToxicity(n.innerText).then(block => {
                if (block) blockElement(n.closest("article") || n.closest("div") || n);
              });
            }
          });
        });
      });

      observer.observe(document.body, { childList: true, subtree: true });
    });
  });
`;

(document.head || document.documentElement).appendChild(logicScript);
