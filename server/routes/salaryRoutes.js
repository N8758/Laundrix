const express = require("express");
const router = express.Router();
const salaryController = require("../controllers/salaryController");

// OWNER
router.post("/generate", salaryController.generateSalary);
router.get("/owner/:owner_id", salaryController.getOwnerSalary);

// STAFF
router.get("/staff/:staff_id", salaryController.getStaffSalary);

module.exports = router;