const db = require("../config/db");


// ✅ ADD STAFF (AUTO staff_id)
exports.addStaff = async (req, res) => {
  try {
    const { owner_id, name, mobile } = req.body;

    


    // Validation
    if (!owner_id || !name || !mobile) {
      return res.status(400).json({ message: "Owner, Name and Mobile are required" });
    }

    // Mobile validation (10 digits only)
const mobileRegex = /^[6-9]\d{9}$/;

if (!mobileRegex.test(mobile)) {
  return res.status(400).json({
    message: "Mobile number must be exactly 10 digits (no +91)"
  });
}

    // 🔥 Convert unique_id → owner_id (INT)
    const ownerResult = await db.query(
      "SELECT owner_id FROM owners WHERE unique_id = $1",
      [owner_id]
    );

    if (ownerResult.rows.length === 0) {
      return res.status(404).json({ message: "Owner not found" });
    }

    const realOwnerId = ownerResult.rows[0].owner_id;

    // Generate unique staff ID
    const staff_id = "STF-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
    

    const result = await db.query(
      
      `INSERT INTO staff (owner_id, name, mobile, staff_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [realOwnerId, name, mobile, staff_id]
    );
    
    res.status(201).json({
      message: "Staff added successfully",
      staff: result.rows[0],
    });

  } catch (error) {
    console.error("Add Staff Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ GET STAFF BY OWNER
exports.getStaffByOwner = async (req, res) => {
  try {
    const { owner_id } = req.params;

    const result = await db.query(
      `SELECT id, name, mobile, staff_id
       FROM staff
       WHERE owner_id = (
         SELECT owner_id FROM owners WHERE unique_id = $1
       )
       ORDER BY created_at DESC`,
      [owner_id]
    );

    res.status(200).json(result.rows);

  } catch (error) {
    console.error("Fetch Staff Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ DELETE STAFF
exports.deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `DELETE FROM staff WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Staff not found" });
    }

    res.status(200).json({ message: "Staff deleted successfully" });

  } catch (error) {
    console.error("Delete Staff Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ UPDATE STAFF (ONLY name + mobile)
exports.updateStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, mobile } = req.body;
    

    if (!name || !mobile) {
      return res.status(400).json({ message: "Name and Mobile required" });
    }

    const mobileRegex = /^[6-9]\d{9}$/;

if (!mobileRegex.test(mobile)) {
  return res.status(400).json({
    message: "Mobile must be exactly 10 digits"
  });
}

    const result = await db.query(
      `UPDATE staff
       SET name = $1, mobile = $2
       WHERE id = $3
       RETURNING id, name, mobile, staff_id`,
      [name, mobile, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Staff not found" });
    }

    res.status(200).json({
      message: "Staff updated successfully",
      staff: result.rows[0],
    });

  } catch (error) {
    console.error("Update Staff Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};




// ✅ STAFF LOGIN
exports.staffLogin = async (req, res) => {
  try {
    const { staff_id, mobile, owner_id } = req.body;

    if (!staff_id || !mobile || !owner_id) {
      return res.status(400).json({
        message: "Staff ID, Mobile and Owner ID required"
      });
    }

    // Validate mobile
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(mobile)) {
      return res.status(400).json({
        message: "Invalid mobile number"
      });
    }

    // Convert unique owner_id → real owner_id
    const ownerResult = await db.query(
      "SELECT owner_id FROM owners WHERE unique_id = $1",
      [owner_id]
    );

    if (ownerResult.rows.length === 0) {
      return res.status(404).json({ message: "Owner not found" });
    }

    const realOwnerId = ownerResult.rows[0].owner_id;
    

    // Check staff
    const result = await db.query(
      `SELECT id, name, mobile, staff_id 
       FROM staff 
       WHERE staff_id = $1 
       AND mobile = $2
       AND owner_id = $3`,
      [staff_id, mobile, realOwnerId]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.status(200).json({
      message: "Login successful",
      staff: result.rows[0]
    });

  } catch (error) {
    console.error("Staff Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};



// ✅ STAFF → GET ASSIGNED BOOKINGS
exports.getAssignedBookings = async (req, res) => {
  try {
    const { staff_id } = req.params;

    if (!staff_id) {
      return res.status(400).json({ message: "staff_id required" });
    }

    const result = await db.query(
`
SELECT
    booking_id,
    items,
    pickup_type,
    total_price,
    status,
    customer_name,
    customer_mobile,
    customer_address,
    latitude,
    longitude,
   pickup_datetime AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata' AS pickup_datetime,
   completion_datetime AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata' AS completion_datetime,
    pickup_staff_id,
    delivery_staff_id,
    created_at
FROM bookings
WHERE pickup_staff_id = $1
   OR delivery_staff_id = $1
ORDER BY created_at DESC
`,
[staff_id]
);

    const bookings = result.rows.map(b => ({
      ...b,
      items: typeof b.items === "string" ? JSON.parse(b.items) : b.items
    }));

    res.json({ bookings });

  } catch (error) {
    console.error("Staff bookings error:", error);
    res.status(500).json({ message: "Server error" });
  }
};