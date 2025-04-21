console.log("🧠 AI Political Blocker script starting...");

// Load TensorFlow.js
const scriptTF = document.createElement('script');
scriptTF.src = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs';
scriptTF.onload = () => {
  console.log("✅ TensorFlow.js loaded!");

  // Load pre-bundled toxicity model (UMD version)
  const scriptToxic = document.createElement('script');
  scriptToxic.src = 'https://cdn.jsdelivr.net/npm/@tensorflow-models/toxicity@1.2.2/dist/toxicity.min.js';
  scriptToxic.onload = () => {
    console.log("✅ Toxicity model script loaded!");

    const threshold = 0.8;
    window.toxicity.load(threshold).then(model => {
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
          console.log("🔒 Blocked suspected political content:", el.innerText?.slice(0, 80));
        }
      }

      // Scan all text nodes
      const blocks = Array.from(document.querySelectorAll("p, span, div, h1, h2, h3"));
      blocks.forEach(el => {
        if (el.innerText && !el.dataset.blocked) {
          checkTextForToxicity(el.innerText).then(block => {
            if (block) blockElement(el.closest("article") || el.closest("div") || el);
          });
        }
      });

      // Observe changes for dynamic content
      const observer = new MutationObserver(muts => {
        muts.forEach(m => {
          m.addedNodes.forEach(n => {
            if (n.nodeType === Node.ELEMENT_NODE) {
              const el = n;
              if (el.innerText && !el.dataset.blocked) {
                checkTextForToxicity(el.innerText).then(block => {
                  if (block) blockElement(el.closest("article") || el.closest("div") || el);
                });
              }
            }
          });
        });
      });
      observer.observe(document.body, { childList: true, subtree: true });
    });
  };
  document.head.appendChild(scriptToxic);
};

document.head.appendChild(scriptTF);
