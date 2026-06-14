const pool = require("../config/db");


// ✅ Generate Salary (OWNER)
exports.generateSalary = async (req, res) => {
  try {
    const { staff_id, month, year, base_salary, incentive = 0 } = req.body;

    // ❗ Validate input
    if (!staff_id || !month || !year || !base_salary) {
      return res.status(400).json({
        message: "All required fields must be provided",
      });
    }

    // 🔥 Get owner_id from staff (secure)
    const staffRes = await pool.query(
      "SELECT owner_id FROM staff WHERE id=$1",
      [staff_id]
    );

    if (staffRes.rows.length === 0) {
      return res.status(400).json({ message: "Staff not found" });
    }

    const owner_id = staffRes.rows[0].owner_id;

    // ❗ Prevent duplicate salary
    const existing = await pool.query(
      `SELECT id FROM salaries 
       WHERE staff_id=$1 AND month=$2 AND year=$3`,
      [staff_id, month, year]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({
        message: "Salary already generated for this month",
      });
    }

    // 📅 Total days in month
    const total_days = new Date(year, month, 0).getDate();

    // ✅ Present days from attendance
    const attendanceRes = await pool.query(
      `SELECT COUNT(*) FROM attendance
       WHERE staff_id=$1 
       AND EXTRACT(MONTH FROM date)=$2
       AND EXTRACT(YEAR FROM date)=$3
       AND check_in IS NOT NULL`,
      [staff_id, month, year]
    );

    const present_days = parseInt(attendanceRes.rows[0].count) || 0;
    const absent_days = total_days - present_days;

    // 💰 Safe salary calculation
    const base = Number(base_salary);
    const bonus = Number(incentive || 0);

    const per_day_salary = base / total_days;
    const final_salary = (per_day_salary * present_days) + bonus;

    // ✅ Insert salary
    const result = await pool.query(
      `INSERT INTO salaries 
      (staff_id, owner_id, month, year, total_days, present_days, absent_days, base_salary, final_salary)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *`,
      [
        staff_id,
        owner_id,
        month,
        year,
        total_days,
        present_days,
        absent_days,
        base,
        final_salary,
      ]
    );

    res.status(201).json({
      message: "Salary generated successfully",
      salary: result.rows[0],
    });

  } catch (err) {
    console.error("Salary Error:", err);
    res.status(500).json({ error: "Salary generation failed" });
  }
};



// ✅ Get Salary (STAFF)
exports.getStaffSalary = async (req, res) => {
  try {
    const { staff_id } = req.params;

    const result = await pool.query(
      "SELECT * FROM salaries WHERE staff_id=$1 ORDER BY created_at DESC",
      [staff_id]
    );

    res.json(result.rows);

  } catch (err) {
    console.error("Fetch Staff Salary Error:", err);
    res.status(500).json({ error: "Fetch failed" });
  }
};



exports.getOwnerSalary = async (req, res) => {
  try {
    const { owner_id } = req.params; // UUID (LDRY-xxxx)

    // 🔥 ADD THIS BLOCK (IMPORTANT)
    const ownerRes = await pool.query(
      "SELECT owner_id FROM owners WHERE unique_id = $1",
      [owner_id]
    );

    if (ownerRes.rows.length === 0) {
      return res.status(404).json({ message: "Owner not found" });
    }

    const realOwnerId = ownerRes.rows[0].owner_id;

    // 🔥 CHANGE HERE: use realOwnerId instead of owner_id
    const result = await pool.query(
      `SELECT s.*, st.name 
       FROM salaries s
       JOIN staff st ON s.staff_id = st.id
       WHERE s.owner_id=$1
       ORDER BY s.created_at DESC`,
      [realOwnerId]   // ✅ FIXED
    );

    res.json(result.rows);

  } catch (err) {
    console.error("Fetch Owner Salary Error:", err);
    res.status(500).json({ error: "Fetch failed" });
  }
};