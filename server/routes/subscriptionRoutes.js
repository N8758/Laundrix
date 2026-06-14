const express = require("express");

const router = express.Router();

const {
  createSubscription,
  createAutoPaySubscription,
  verifyPayment,
  getSubscriptionStatus,
  cancelAutoPay
} = require("../controllers/subscriptionController");



router.post(
  "/create-subscription",
  createSubscription
);



router.post(
  "/create-autopay",
  createAutoPaySubscription
);



router.post(
  "/verify-payment",
  verifyPayment
);



router.get(
  "/status/:ownerId",
  getSubscriptionStatus
);



router.post(
"/cancel-autopay",
cancelAutoPay
);

module.exports = router;