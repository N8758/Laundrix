const multer = require("multer");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {

   const ownerID = req.ownerID;

const serviceID =
  req.body.serviceId ||
  req.body.id ||
  `SVC_${Date.now()}`;
    const dir = `uploads/${ownerID}/${serviceID}`;

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    cb(null, dir);
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

module.exports = upload;