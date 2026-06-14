const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendanceController");

// Check-In
router.post("/checkin", attendanceController.checkIn);

// Check-Out
router.post("/checkout", attendanceController.checkOut);
router.get("/owner/:owner_id", attendanceController.getOwnerAttendance);


// Get Attendance
router.get("/:staff_id", attendanceController.getAttendance);


module.exports = router;