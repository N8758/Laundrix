const express = require("express");
const router = express.Router();

const billingController = require("../controllers/billingController");

// ✅ Generate Bill
router.post("/generate", billingController.generateBill);

router.get("/check/:bookingId", billingController.checkBill);

module.exports = router;