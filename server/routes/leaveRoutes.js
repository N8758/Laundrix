const express = require("express");
const router = express.Router();
const leaveController = require("../controllers/leaveController");

// STAFF
router.post("/apply", leaveController.applyLeave);
router.get("/staff/:staff_id", leaveController.getStaffLeaves);

// OWNER
router.get("/owner/:owner_id", leaveController.getOwnerLeaves);
router.patch("/update/:id", leaveController.updateLeaveStatus);

module.exports = router;