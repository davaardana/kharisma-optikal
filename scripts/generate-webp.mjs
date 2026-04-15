import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const srcDir = path.join(root, 'src');
const outDir = path.join(root, 'public', 'optimized');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const files = ['img1.jpg', 'img2.jpg', 'img3.jpg', 'img4.jpg', 'img5.jpg', 'img6.jpg'];
const widths = [640, 960, 1280];

for (const file of files) {
  const inputPath = path.join(srcDir, file);
  const base = path.basename(file, path.extname(file));

  for (const width of widths) {
    const outPath = path.join(outDir, `${base}-${width}.webp`);
    await sharp(inputPath)
      .resize({ width, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 78, effort: 5 })
      .toFile(outPath);
  }
}

console.log('Generated optimized WebP files in public/optimized');
