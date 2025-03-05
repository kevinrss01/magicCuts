import fs from "fs";
import path from "path";
import sharp from "sharp";

async function generateFavicon() {
  // Get the correct path to the public directory
  const publicDir = path.resolve("frontend/public");
  const pngPath = path.join(publicDir, "favicon.png");
  const icoPath = path.join(publicDir, "favicon.ico");

  try {
    // Check if favicon.png exists
    if (!fs.existsSync(pngPath)) {
      console.error("favicon.png not found in public directory:", pngPath);
      return;
    }

    // Convert PNG to ICO (actually it's just a resized PNG with .ico extension)
    await sharp(pngPath)
      .resize(32, 32) // Standard favicon size
      .toFile(icoPath);

    console.log("favicon.ico generated successfully");
  } catch (error) {
    console.error("Error generating favicon.ico:", error);
  }
}

generateFavicon();
