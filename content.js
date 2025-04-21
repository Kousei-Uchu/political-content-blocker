console.log("🧠 AI Political Blocker script starting...");

// Dynamically load TensorFlow.js into the page
const scriptTF = document.createElement('script');
scriptTF.src = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@3.0.0/dist/tf.min.js';
scriptTF.onload = function () {
  console.log("✅ TensorFlow.js loaded!");
  
  // After TensorFlow.js is loaded, we can proceed to load the toxicity model
  tf.loadGraphModel('https://cdn.jsdelivr.net/npm/@tensorflow-models/toxicity').then(model => {
    console.log("🔍 Toxicity model loaded!");

    // Function to check if the text is political
    function checkTextForPoliticalContent(text) {
      return model.classify([text]).then(predictions => {
        const toxicPredictions = predictions.filter(prediction => prediction.className === 'toxicity' && prediction.probabilities[1] > 0.7);
        return toxicPredictions.length > 0;
      });
    }

    // Function to block the element (hide it)
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

    // Load NSFW.js script
    const scriptNSFW = document.createElement('script');
    scriptNSFW.src = 'https://cdn.jsdelivr.net/npm/nsfwjs@2.0.0/dist/nsfwjs.min.js';
    scriptNSFW.onload = () => {
      nsfwjs.load().then(model => {
        console.log("🔍 NSFW.js model loaded!");

        // Function to analyze images for political content
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
    document.head.appendChild(scriptNSFW);
  });
};

document.head.appendChild(scriptTF); // Add the script to the page after the onload function
