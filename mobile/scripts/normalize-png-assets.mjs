import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const assetsRoot = path.join(process.cwd(), 'assets');

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
    } else if (/\.png$/i.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

async function normalizePng(filePath) {
  const meta = await sharp(filePath).metadata();
  const png = await sharp(filePath)
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toBuffer();

  const tempPath = `${filePath}.tmp`;
  await fs.writeFile(tempPath, png);
  await fs.rename(tempPath, filePath);

  if (meta.format !== 'png') {
    console.log(`Converted ${path.relative(assetsRoot, filePath)} from ${meta.format} to PNG`);
  }
}

async function main() {
  const pngFiles = await walk(assetsRoot);
  for (const filePath of pngFiles) {
    await normalizePng(filePath);
  }
  console.log(`Normalized ${pngFiles.length} PNG assets.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
