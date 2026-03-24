const Jimp = require("jimp");

async function fixLogo() {
  try {
    const image = await Jimp.read("public/logo.png");
    const width = image.bitmap.width;
    const height = image.bitmap.height;

    // The AI watermark (like Imagen or Midjourney) is usually in the bottom right corner
    // We will paint over the bottom-right 120x120 pixels with the background color
    
    // Let's sample a pixel just outside that bottom right watermark area
    const sampleColor = image.getPixelColor(width - 150, height - 150);

    // Overwrite the bottom-right pixels
    for (let x = width - 150; x < width; x++) {
      for (let y = height - 150; y < height; y++) {
        image.setPixelColor(sampleColor, x, y);
      }
    }

    await image.writeAsync("public/logo.png");
    console.log("Logo fixed successfully! Overwrote bottom-right corner.");
  } catch (err) {
    console.error("Error processing image:", err);
  }
}

fixLogo();
