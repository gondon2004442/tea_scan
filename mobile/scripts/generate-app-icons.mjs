import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(process.cwd());
const smilePath = path.join(root, 'assets', 'images', 'icon-smile.png');
const assetsDir = path.join(root, 'assets');

const background = '#dce49c';

async function main() {
  const icon = await sharp(smilePath)
    .resize(640, 640, { fit: 'contain', background })
    .extend({
      top: 192,
      bottom: 192,
      left: 192,
      right: 192,
      background,
    })
    .png()
    .toBuffer();

  await fs.writeFile(path.join(assetsDir, 'icon.png'), icon);
  await fs.writeFile(path.join(assetsDir, 'favicon.png'), await sharp(icon).resize(48, 48).png().toBuffer());
  await fs.writeFile(path.join(assetsDir, 'android-icon-foreground.png'), icon);
  await fs.writeFile(
    path.join(assetsDir, 'android-icon-background.png'),
    await sharp({
      create: {
        width: 1024,
        height: 1024,
        channels: 4,
        background: '#E6F4FE',
      },
    })
      .png()
      .toBuffer(),
  );
  await fs.writeFile(path.join(assetsDir, 'android-icon-monochrome.png'), icon);

  console.log('Generated app icons in assets/.');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
