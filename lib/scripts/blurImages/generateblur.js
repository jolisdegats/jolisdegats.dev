import { getPlaiceholder } from "plaiceholder";
import fs from "fs";
import path from "path";

const EXCLUDE_DIRS = new Set([
  "node_modules",
  ".git",
  ".next",
  "dist",
  "build",
  ".turbo",
  ".cache",
  "coverage",
]);

const outputFile = path.join(process.cwd(), "lib/scripts/blurImages/blurHashes.json");
const imageExtensions = [".webp", ".png", ".jpg", ".jpeg", ".gif"];

async function generateBlurs() {
  const blurHashes = {};
  let processedCount = 0;
  let errorCount = 0;

  function findImages(dir) {
    if (!fs.existsSync(dir)) {
      return [];
    }

    const items = fs.readdirSync(dir);
    const imagePaths = [];

    for (const item of items) {
      if (EXCLUDE_DIRS.has(item)) {
        continue;
      }

      const fullPath = path.join(dir, item);
      
      try {
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          imagePaths.push(...findImages(fullPath));
        } else if (imageExtensions.some((ext) => item.toLowerCase().endsWith(ext))) {
          imagePaths.push(fullPath);
        }
      } catch (error) {
        continue;
      }
    }

    return imagePaths;
  }

  console.log("Scanning entire repo for images...\n");
  const allImagePaths = findImages(process.cwd());

  console.log(`Found ${allImagePaths.length} images to process...\n`);

  for (const filePath of allImagePaths) {
    try {
      const buffer = fs.readFileSync(filePath);
      const { base64 } = await getPlaiceholder(buffer);
      
      const filename = path.basename(filePath);
      blurHashes[filename] = base64;
      
      console.log(`✓ Generated blur for ${filename}`);
      processedCount++;
    } catch (error) {
      const filename = path.basename(filePath);
      if (error instanceof Error) {
        console.error(`✗ Failed for ${filename}:`, error.message);
      } else {
        console.error(`✗ Failed for ${filename}:`, error);
      }
      errorCount++;
    }
  }

  fs.writeFileSync(outputFile, JSON.stringify(blurHashes, null, 2));
  console.log(`\n✓ Blur hashes saved to lib/scripts/blurImages/blurHashes.json`);
  console.log(`✓ Processed: ${processedCount} | ✗ Failed: ${errorCount}`);
}

generateBlurs().catch((error) => {
  console.error("Fatal error generating blurs:", error);
  process.exit(1);
});