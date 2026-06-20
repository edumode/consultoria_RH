// Genera favicon.ico (16/32/48) y apple-icon.png (180) desde public/logo.svg.
// El logo tiene fondo crema propio; rellenamos el cuadrado con el mismo crema.
import sharp from "sharp";
import { writeFileSync } from "node:fs";

const SRC = "public/logo.svg";
const APP = "src/app";
const BG = "#fdfaf3";

async function png(size) {
  // ensureAlpha() → PNG en RGBA (Next exige RGBA para los PNG dentro del .ico).
  return sharp(SRC, { density: 300 })
    .resize(size, size, { fit: "contain", background: BG })
    .ensureAlpha()
    .png()
    .toBuffer();
}

const apple = await png(180);
writeFileSync(`${APP}/apple-icon.png`, apple);

const sizes = [16, 32, 48];
const imgs = [];
for (const s of sizes) imgs.push({ s, buf: await png(s) });

const count = imgs.length;
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reservado
header.writeUInt16LE(1, 2); // tipo = icono
header.writeUInt16LE(count, 4);

const entries = [];
let offset = 6 + count * 16;
for (const { s, buf } of imgs) {
  const e = Buffer.alloc(16);
  e.writeUInt8(s, 0); // ancho
  e.writeUInt8(s, 1); // alto
  e.writeUInt8(0, 2); // colores de paleta
  e.writeUInt8(0, 3); // reservado
  e.writeUInt16LE(1, 4); // planos
  e.writeUInt16LE(32, 6); // bits por pixel
  e.writeUInt32LE(buf.length, 8);
  e.writeUInt32LE(offset, 12);
  entries.push(e);
  offset += buf.length;
}

const ico = Buffer.concat([header, ...entries, ...imgs.map((i) => i.buf)]);
writeFileSync(`${APP}/favicon.ico`, ico);

console.log(`apple-icon.png: ${apple.length}B · favicon.ico: ${ico.length}B (${sizes.join("/")})`);
