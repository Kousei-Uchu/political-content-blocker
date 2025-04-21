# AI Political Content Blocker Extension

## Overview
This extension uses AI models to scan text and images on web pages and hide any content that is deemed political. The extension uses a pre-trained toxicity detection model for text and a pre-trained NSFWJS model for images.

## Files Included
- `manifest.json`: Configuration for the extension.
- `content.js`: JavaScript code to filter content.
- `tf.min.js`, `toxicity.min.js`, `nsfwjs.min.js`: Pre-trained AI models for content detection.
- `README.md`: Instructions for installation and usage.

## How to Install
1. **Chrome**:
   - Open `chrome://extensions/` in your browser.
   - Enable **Developer Mode**.
   - Click **Load Unpacked** and select the folder where you saved this extension.
   - The extension will be installed and will automatically block political content as you browse.

2. **Firefox**:
   - Go to `about:debugging#/runtime/this-firefox` in the address bar.
   - Click **Load Temporary Add-on** and select the `manifest.json` file from your extension folder.

## How It Works
- The extension scans all text content on the page (posts, articles, comments, etc.) using the **toxicity model**.
- It scans images using the **NSFWJS model**.
- If either model detects political content, the respective element is hidden.

## Notes
- This extension runs entirely offline, so no personal data is sent to external servers.
