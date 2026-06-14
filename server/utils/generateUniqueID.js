const fs = require("fs");
const path = require("path");

const dataFile = path.join(__dirname, "../data.json");

function readData() {
  return JSON.parse(fs.readFileSync(dataFile, "utf8"));
}

function writeData(data) {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

// generateUniqueID.js
function generateUniqueID(prefix = "LDRY") {
  const random = Math.random().toString(16).substring(2, 8).toUpperCase();
  return `${prefix}-${random}`;
}

module.exports = generateUniqueID;
