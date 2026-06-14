const express = require('express');
const path = require('path');   // <-- ADD THIS

const cors = require('cors');
require("dotenv").config();

const adminRoutes = require("./routes/adminRoutes");
const ownerRoutes = require("./routes/ownerRoutes");
const customerRoutes = require("./routes/customerRoutes");
const servicesRoutes = require("./routes/servicesRoutes"); // ✅ ADD THIS
const staffRoutes = require("./routes/staffRoutes");
const billingRoutes = require("./routes/billingRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const leaveRoutes = require("./routes/leaveRoutes");
const salaryRoutes = require("./routes/salaryRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");

const app = express();
require("./cron/subscriptionCron");

app.use(cors());


app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);


// Increase body limit for image upload
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));


// ROUTES
app.use("/api/admin", adminRoutes);
app.use("/api/owner", ownerRoutes);
app.use("/api/owner/services", servicesRoutes); // ✅ ADD THIS LINE
app.use("/api/customer", customerRoutes);
app.use("/api/feedback", require("./routes/feedbackRoutes"));
app.use("/api/booking", require("./routes/bookingRoutes"));
app.use("/api/owner/staff", staffRoutes);
app.use("/api/billing", billingRoutes);

app.use("/api/attendance", attendanceRoutes);
app.use("/api/leave", leaveRoutes);
app.use("/api/salary", salaryRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/salary", salaryRoutes);

// Test Route
app.get('/', (req, res) => {
  res.send("Laundry Server Running Successfully!");
});

module.exports = app;
