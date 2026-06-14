const pool = require("../config/db");


// 📍 Distance calculation (Haversine)
const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3;
  const toRad = (x) => (x * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

// ✅ Check-In
exports.checkIn = async (req, res) => {
  try {
    // ✅ FIRST get data
    const { staff_id, lat, lng } = req.body;

    // 🔥 THEN use staff_id
    const staffRes = await pool.query(
      "SELECT owner_id FROM staff WHERE id = $1",
      [staff_id]
    );

    if (staffRes.rows.length === 0) {
      return res.status(400).json({ message: "Staff not found" });
    }

    const owner_id = staffRes.rows[0].owner_id;

    // 🔍 Get shop location
    const owner = await pool.query(
      "SELECT latitude, longitude FROM owners WHERE owner_id=$1",
      [owner_id]
    );

    if (owner.rows.length === 0) {
      return res.status(400).json({ message: "Owner not found" });
    }

    const shopLat = owner.rows[0].latitude;
    const shopLng = owner.rows[0].longitude;

    const distance = getDistance(lat, lng, shopLat, shopLng);

    if (distance > 100) {
      return res.status(400).json({
        message: "You are too far from shop (100m allowed)",
      });
    }

    const already = await pool.query(
      "SELECT * FROM attendance WHERE staff_id=$1 AND date=CURRENT_DATE",
      [staff_id]
    );

    if (already.rows.length > 0) {
      return res.status(400).json({ message: "Already checked in today" });
    }

    const result = await pool.query(
      `INSERT INTO attendance (staff_id, owner_id, check_in)
       VALUES ($1, $2, NOW()) RETURNING *`,
      [staff_id, owner_id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Check-in failed" });
  }
};

// ✅ Check-Out
exports.checkOut = async (req, res) => {
  try {
    const { staff_id, lat, lng } = req.body;

    const staffRes = await pool.query(
  "SELECT owner_id FROM staff WHERE id = $1",
  [staff_id]
);

if (staffRes.rows.length === 0) {
  return res.status(400).json({ message: "Staff not found" });
}

const owner_id = staffRes.rows[0].owner_id;

    // 🔍 Get shop location
    const owner = await pool.query(
      "SELECT latitude, longitude FROM owners WHERE owner_id=$1",
      [owner_id]
    );

    if (owner.rows.length === 0) {
      return res.status(400).json({ message: "Owner not found" });
    }

    const shopLat = owner.rows[0].latitude;
    const shopLng = owner.rows[0].longitude;

    // 📏 Check distance
    const distance = getDistance(lat, lng, shopLat, shopLng);

    if (distance > 100) {
      return res.status(400).json({
        message: "You are too far from shop to check-out",
      });
    }

    // ✅ Update checkout
    const result = await pool.query(
      `UPDATE attendance
       SET check_out = NOW()
       WHERE staff_id=$1 AND date=CURRENT_DATE
       RETURNING *`,
      [staff_id]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        message: "Check-in not found for today",
      });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Check-out failed" });
  }
};

// ✅ Get Attendance
exports.getAttendance = async (req, res) => {
  try {
    const { staff_id } = req.params;

    const result = await pool.query(
      "SELECT * FROM attendance WHERE staff_id=$1 ORDER BY date DESC",
      [staff_id]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Fetch failed" });
  }
};








// ✅ Owner Attendance (ALL staff)
exports.getOwnerAttendance = async (req, res) => {
  try {
    const { owner_id } = req.params;

    const result = await pool.query(
      `SELECT a.*, s.name 
       FROM attendance a
       JOIN staff s ON a.staff_id = s.id
       WHERE a.owner_id = $1
       ORDER BY a.check_in DESC`,
      [owner_id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Owner attendance fetch failed" });
  }
};