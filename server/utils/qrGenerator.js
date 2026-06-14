const QRCode = require("qrcode");

// returns a data URL PNG (base64) to store in JSON or send to frontend
async function generateQRCodeDataURL(text) {
  try {
    const dataUrl = await QRCode.toDataURL(text);
    return dataUrl;
  } catch (err) {
    throw err;
  }
}

module.exports = generateQRCodeDataURL;
