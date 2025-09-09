const fs = require('fs');
const path = require('path');

function readUInt32BE(buf, offset) {
  return buf.readUInt32BE(offset);
}

async function embed() {
  const src = path.join(__dirname, '../public/uploads/divanailslogo.png');
  const out = path.join(__dirname, '../public/favicon.ico');

  if (!fs.existsSync(src)) {
    console.error('Source PNG not found at', src);
    process.exit(1);
  }

  const png = fs.readFileSync(src);

  // Validate PNG signature
  const pngSig = Buffer.from([0x89,0x50,0x4E,0x47,0x0D,0x0A,0x1A,0x0A]);
  if (!png.slice(0,8).equals(pngSig)) {
    console.error('Source is not a valid PNG');
    process.exit(1);
  }

  // Read IHDR chunk to get width/height (IHDR starts at offset 8+8=16)
  // PNG structure: 8-byte sig, then chunks (length(4), type(4), data(length), crc(4))
  // First chunk should be IHDR with 13 bytes of data.
  const ihdrOffset = 8 + 8; // sig + first chunk length+type
  const width = readUInt32BE(png, ihdrOffset);
  const height = readUInt32BE(png, ihdrOffset + 4);

  const widthByte = width >= 256 ? 0 : width;
  const heightByte = height >= 256 ? 0 : height;

  // Build ICONDIR (6 bytes)
  const iconDir = Buffer.alloc(6);
  iconDir.writeUInt16LE(0, 0); // reserved
  iconDir.writeUInt16LE(1, 2); // type (1 = ICO)
  iconDir.writeUInt16LE(1, 4); // count

  // Build ICONDIRENTRY (16 bytes)
  const entry = Buffer.alloc(16);
  entry.writeUInt8(widthByte, 0); // width
  entry.writeUInt8(heightByte, 1); // height
  entry.writeUInt8(0, 2); // color count
  entry.writeUInt8(0, 3); // reserved
  entry.writeUInt16LE(1, 4); // planes
  entry.writeUInt16LE(32, 6); // bitcount
  entry.writeUInt32LE(png.length, 8); // bytes in resource
  entry.writeUInt32LE(iconDir.length + entry.length, 12); // image offset

  const ico = Buffer.concat([iconDir, entry, png]);
  fs.writeFileSync(out, ico);
  console.log('Wrote', out, '(', png.length, 'bytes embedded, size', width, 'x', height, ')');
}

embed();
