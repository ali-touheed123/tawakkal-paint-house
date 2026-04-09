// Image compression script using sharp
// Run: node compress-images.mjs
import sharp from 'sharp';
import { existsSync } from 'fs';
import { join } from 'path';

const PUBLIC = './public';

const tasks = [
  // Hero image — convert to WebP, quality 65
  {
    input: `${PUBLIC}/home-hero.jpeg`,
    output: `${PUBLIC}/home-hero.webp`,
    opts: { webp: { quality: 65 } },
  },
  // Logo — compress PNG, strip metadata
  {
    input: `${PUBLIC}/logo.png`,
    output: `${PUBLIC}/logo.png`,
    opts: { png: { compressionLevel: 9, quality: 80 } },
    overwrite: true,
  },
  // Favicon — compress heavily (it's 245 KiB!)
  {
    input: `${PUBLIC}/favicon-tph.png`,
    output: `${PUBLIC}/favicon-tph.png`,
    opts: { png: { compressionLevel: 9, quality: 70 } },
    overwrite: true,
  },
  // Brand images
  ...['berger', 'brighto', 'choice', 'diamond', 'dior', 'gobis', 'reliable', 'reliance', 'rozzi', 'saasi'].map(name => ({
    input: `${PUBLIC}/images/brands/${name}.png`,
    output: `${PUBLIC}/images/brands/${name}.png`,
    opts: { png: { compressionLevel: 9, quality: 75 } },
    overwrite: true,
  })),
];

let totalSaved = 0;

for (const task of tasks) {
  if (!existsSync(task.input)) {
    console.log(`⚠️  Skipping (not found): ${task.input}`);
    continue;
  }

  const img = sharp(task.input).withMetadata(false); // strip EXIF
  const { size: beforeSize } = await sharp(task.input).metadata();

  let pipeline;
  if (task.opts.webp) {
    pipeline = img.webp(task.opts.webp);
  } else if (task.opts.png) {
    pipeline = img.png(task.opts.png);
  }

  const buf = await pipeline.toBuffer({ resolveWithObject: true });
  const afterSize = buf.info.size;

  // Read original size
  const { default: fs } = await import('fs');
  const originalSize = fs.statSync(task.input).size;
  const saved = originalSize - afterSize;
  totalSaved += saved;

  fs.writeFileSync(task.output, buf.data);

  const pct = Math.round((saved / originalSize) * 100);
  console.log(`✅ ${task.input.split('/').pop()} → ${(afterSize / 1024).toFixed(1)} KiB (saved ${(saved / 1024).toFixed(1)} KiB, ${pct}%)`);
}

console.log(`\n🎉 Total saved: ${(totalSaved / 1024).toFixed(1)} KiB`);
