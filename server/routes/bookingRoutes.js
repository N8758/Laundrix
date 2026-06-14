const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/bookingController");

router.post("/create", ctrl.createBooking);
router.get("/owner/:ownerId", ctrl.getOwnerBookings);
router.get("/customer/:ownerId", ctrl.getCustomerBookings);
/* CUSTOMER DELETE / CANCEL */
router.patch("/customer/hide/:bookingId", ctrl.hideCustomerBooking);

/* OWNER ACTIONS */
router.patch("/owner/confirm", ctrl.confirmBooking);
router.patch("/owner/hide/:bookingId", ctrl.hideOwnerBooking);
router.patch("/owner/update-weight/:bookingId", ctrl.updateWeight); 
router.get("/owner/:ownerId/stats", ctrl.getOwnerStats);
router.patch("/owner/complete", ctrl.completeBooking);

router.patch("/owner/cancel/:bookingId", ctrl.cancelBooking);
router.patch("/owner/reschedule/:bookingId", ctrl.rescheduleBooking);

router.patch("/owner/assign-staff", ctrl.assignStaff);

router.get("/owner/staff/bookings/:staffId", ctrl.getStaffBookings);


// CUSTOMER REQUESTS
router.patch(
"/customer/cancel-request/:bookingId",
ctrl.customerCancelRequest
);

router.patch(
"/customer/reschedule-request/:bookingId",
ctrl.customerRescheduleRequest
);


router.patch(
  "/staff/complete-delivery/:bookingId",
  ctrl.completeDelivery
);

module.exports = router;
