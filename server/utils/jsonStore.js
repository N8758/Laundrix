// server/utils/jsonStore.js
const fs = require("fs");
const path = require("path");
const dataFile = path.join(__dirname, "../data.json");

function readData() {
  try {
    const raw = fs.readFileSync(dataFile, "utf8");
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    // if missing or invalid, return empty structure
    return { pendingOwners: [], approvedOwners: [], whatsapp: [], otps: [], orders: [] ,  feedbacks: []  };
  }
}

function writeData(data) {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

module.exports = { readData, writeData };
