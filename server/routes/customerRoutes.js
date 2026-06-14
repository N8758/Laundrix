// server/routes/customerRoutes.js
const express = require("express");
const router = express.Router();
const customer = require("../controllers/customerController");

router.post("/request-otp", customer.requestOtp);
router.post("/verify-otp", customer.verifyOtp);

router.get("/owner/:id", customer.getOwnerById);
router.get("/owner/:id/services", customer.getOwnerServices);


router.get("/me", customer.getMe);
router.patch("/update-profile", customer.updateCustomerProfile);
module.exports = router;
