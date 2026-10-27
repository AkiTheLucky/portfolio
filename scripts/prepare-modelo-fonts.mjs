import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const destination = path.resolve('public/fonts/modelo');
const fonts = {
  'Modelo-Light.woff2': process.env.MODELO_FONT_LIGHT_BASE64,
  'Modelo-Regular.woff2': process.env.MODELO_FONT_REGULAR_BASE64,
  'Modelo-Bold.woff2': process.env.MODELO_FONT_BOLD_BASE64,
  'Modelo-Black.woff2': process.env.MODELO_FONT_BLACK_BASE64,
};

const configured = Object.entries(fonts).filter(([, value]) => Boolean(value));
if (configured.length === 0) {
  console.log('Modelo font secrets are not configured; keeping existing local font files or using the fallback font.');
  process.exit(0);
}

if (configured.length !== Object.keys(fonts).length) {
  throw new Error('Set all four MODELO_FONT_*_BASE64 secrets, or none of them.');
}

await mkdir(destination, { recursive: true });
for (const [filename, encoded] of Object.entries(fonts)) {
  await writeFile(path.join(destination, filename), Buffer.from(encoded, 'base64'));
}
console.log(`Installed ${Object.keys(fonts).length} licensed Modelo webfonts into ${destination}.`);
