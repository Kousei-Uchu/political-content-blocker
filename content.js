console.log("🧠 AI Political Blocker AI script starting...");

// Load TensorFlow.js and models
const scriptTF = document.createElement('script');
scriptTF.src = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@3.0.0/dist/tf.min.js';
document.head.appendChild(scriptTF);

scriptTF.onload = () => {
  // Load toxicity model
  tf.loadGraphModel('https://cdn.jsdelivr.net/npm/@tensorflow-models/toxicity').then(model => {
    console.log("🔍 Toxicity model loaded!");

    // Function to detect political content in text
    function checkTextForPoliticalContent(text) {
      return model.classify([text]).then(predictions => {
        const toxicPredictions = predictions.filter(prediction => prediction.className === 'toxicity' && prediction.probabilities[1] > 0.7);
        return toxicPredictions.length > 0;
      });
    }

    // Function to block elements
    function blockElement(el) {
      if (el && el.style) {
        el.style.display = "none";
        el.setAttribute("data-blocked", "true");
        console.log("🔒 Blocked suspected political content:", el.innerText?.slice(0, 100) || "[element]");
      }
    }

    // Check all text on the page
    const allTextBlocks = Array.from(document.querySelectorAll("p, span, div, h1, h2, h3"));
    allTextBlocks.forEach(el => {
      if (!el.hasAttribute("data-blocked") && el.innerText) {
        checkTextForPoliticalContent(el.innerText).then(isPolitical => {
          if (isPolitical) {
            blockElement(el.closest("article") || el.closest("div") || el);
          }
        });
      }
    });

    // MutationObserver for dynamically added content
    const observer = new MutationObserver((mutationsList, observer) => {
      console.log("🔄 Detected page change, rescanning...");
      allTextBlocks.forEach(el => {
        if (!el.hasAttribute("data-blocked") && el.innerText) {
          checkTextForPoliticalContent(el.innerText).then(isPolitical => {
            if (isPolitical) {
              blockElement(el.closest("article") || el.closest("div") || el);
            }
          });
        }
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Image analysis using NSFW.js
    const scriptNSFW = document.createElement('script');
    scriptNSFW.src = 'https://cdn.jsdelivr.net/npm/nsfwjs@2.0.0/dist/nsfwjs.min.js';
    document.head.appendChild(scriptNSFW);

    scriptNSFW.onload = () => {
      nsfwjs.load().then(model => {
        console.log("🔍 NSFW.js model loaded!");

        // Function to analyze image for political content
        function analyzeImage(img) {
          model.classify(img).then(predictions => {
            const politicalImage = predictions.some(pred => pred.className.toLowerCase().includes("political") && pred.probability > 0.7);
            if (politicalImage) {
              img.style.display = "none";
              console.log("🔒 Blocked political image:", img.src);
            }
          });
        }

        // Check all images on the page
        const imgElements = Array.from(document.getElementsByTagName('img'));
        imgElements.forEach(img => {
          analyzeImage(img);
        });
      });
    };
  });
};
