const express = require("express");
const router = express.Router();

const {
  manageServices,
  getOwnerServices
} = require("../controllers/servicesController");

const upload = require("../middleware/upload");
const verifyOwner = require("../middleware/verifyOwner");

router.post(
  "/",
  verifyOwner,
  upload.single("image"),
  manageServices
);

router.get("/", verifyOwner, getOwnerServices);

module.exports = router;