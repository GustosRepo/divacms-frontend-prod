const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const toIco = require('to-ico');

async function generate() {
  const input = path.join(__dirname, '../public/uploads/divanailslogo.png');
  const out = path.join(__dirname, '../public/favicon.ico');

  if (!fs.existsSync(input)) {
    console.error('Source logo not found at', input);
    process.exit(1);
  }

  try {
    const sizes = [16, 24, 32, 48, 64, 128, 256];
    const buffers = await Promise.all(
      sizes.map(s => sharp(input).resize(s, s).png().toBuffer())
    );

    const ico = await toIco(buffers);
    fs.writeFileSync(out, ico);
    console.log('favicon.ico written to', out);
  } catch (err) {
    console.error('Error generating favicon:', err);
    process.exit(1);
  }
}

generate();
