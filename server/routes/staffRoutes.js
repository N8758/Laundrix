const express = require("express");
const router = express.Router();

const {
  addStaff,
  getStaffByOwner,
  deleteStaff,
  updateStaff,
   staffLogin ,
   getAssignedBookings 
} = require("../controllers/staffController");

// ✅ ADD STAFF
router.post("/add", addStaff);


router.post("/login", staffLogin);

// ✅ GET STAFF BY OWNER
router.get("/:owner_id", getStaffByOwner);

// ✅ DELETE STAFF
router.delete("/:id", deleteStaff);

// ✅ UPDATE STAFF
router.put("/:id", updateStaff);

router.get("/bookings/:staff_id", getAssignedBookings);

module.exports = router;