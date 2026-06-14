const jwt = require("jsonwebtoken");
const pool = require("../config/db");

// UTILS
const generateUniqueID = require("../utils/generateUniqueID");
const generateQRCodeDataURL = require("../utils/qrGenerator");
const sendWhatsAppSimulator = require("../utils/sendWhatsAppSimulator");

// Load admin credentials
const { adminEmail, adminPassword } = require("../config/adminCredentials");


const inactiveReminderTemplate = (ownerName) => {

  return `
Hello ${ownerName},

We noticed that your Laundry Management System is inactive.

If you are facing any issue or need support, please contact us:

📞 Support Number: +91 9876543210
📧 Support Email: support@laundryapp.com

Thank you.
  `;

};


/* ---------------------------------------------------------
   ADMIN LOGIN
---------------------------------------------------------- */
exports.adminLogin = (req, res) => {
  const { email, password } = req.body;

  if (email !== adminEmail || password !== adminPassword) {
    return res.status(401).json({ message: "Invalid admin credentials" });
  }

  const token = jwt.sign(
    { role: "admin", email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return res.status(200).json({
    message: "Admin login successful",
    token,
  });
};

/* ---------------------------------------------------------
   LIST PENDING OWNERS
---------------------------------------------------------- */
exports.listPendingOwners = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM owners WHERE status = 'pending'"
    );

    res.json({ pending: result.rows });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ---------------------------------------------------------
   APPROVE OWNER  (NEW FIXED VERSION)
---------------------------------------------------------- */
exports.approveOwner = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "email is required" });
    }

    const result = await pool.query(
      "SELECT * FROM owners WHERE email=$1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Owner not found" });
    }

    const owner = result.rows[0];
    if (owner.status === "approved") {
  return res.json({ message: "Owner already approved" });
}

    const uniqueID = generateUniqueID();
    const qrDataUrl = await generateQRCodeDataURL(uniqueID);

    await pool.query(
      `UPDATE owners 
       SET status='approved',
           unique_id=$1,
           qr_code_data_url=$2
       WHERE email=$3`,
      [uniqueID, qrDataUrl, email]
    );

    await sendWhatsAppSimulator(
  owner.mobile,
  "nilesh_content_one",
  [
    owner.owner_name,
    "Your Laundry Account",
    "Login Credentials",
    `ID: ${uniqueID}`,
    `Password: ${owner.password}`,
    "log in and start using your account",
    "do not share your ID and password with anyone"
  ]
);

    res.json({
  message: "Owner approved successfully",
  uniqueID
});

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
/* ---------------------------------------------------------
   LIST APPROVED OWNERS
---------------------------------------------------------- */
/* ---------------------------------------------------------
   LIST APPROVED OWNERS
---------------------------------------------------------- */
exports.listApprovedOwners = async (req, res) => {

  try {

    // Auto set inactive owners
    await pool.query(`
      UPDATE owners
      SET usage_status = 'inactive'
      WHERE last_active IS NOT NULL
      AND last_active < NOW() - INTERVAL '8 days'
    `);

    // Get approved owners
    const result = await pool.query(
      `
      SELECT *
      FROM owners
      WHERE status = 'approved'
      `
    );

    // Console alert for inactive owners
    result.rows.forEach((owner) => {

      if (owner.usage_status === "inactive") {

       
      }

    });

    res.json({
      approved: result.rows
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server error"
    });

  }

};

/* ---------------------------------------------------------
   SEND REMINDER
---------------------------------------------------------- */
exports.sendReminder = async (req, res) => {

  try {

    const { ownerName } = req.body;

    const ownerResult = await pool.query(
      "SELECT * FROM owners WHERE owner_name=$1",
      [ownerName]
    );

    if (ownerResult.rows.length === 0) {
      return res.status(404).json({
        message: "Owner not found"
      });
    }

    const owner = ownerResult.rows[0];

    await sendWhatsAppSimulator(
      owner.mobile,
      "inactive_system_reminder",
      [
        owner.owner_name,
        "+919876543210",
        "support@laundryapp.com"
      ]
    );

    res.json({
      message: "Reminder sent successfully"
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server error"
    });

  }

};