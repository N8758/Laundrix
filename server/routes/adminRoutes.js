const express = require("express");
const router = express.Router();
const { 
  adminLogin, 
  listPendingOwners, 
  approveOwner,
  listApprovedOwners,
  sendReminder   // <-- ADD THIS
} = require("../controllers/adminController");

router.post("/login", adminLogin);
router.get("/pending", listPendingOwners);
router.post("/approve", approveOwner);
router.get("/approved", listApprovedOwners);  // <-- NOW WORKS
router.post("/send-reminder", sendReminder);

// OPTIONAL – WhatsApp viewer
const fs = require("fs");
const path = require("path");
router.get("/whatsapp", (req,res) => {
  const data = JSON.parse(
    fs.readFileSync(path.join(__dirname,'../data.json'), 'utf8')
  );
  res.json({ whatsapp: data.whatsapp || [] });
});

module.exports = router;
