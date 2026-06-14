const pool = require("../config/db");

exports.generateBill = async (req, res) => {
  try {
    const { bookingId, extraCharges, discount, extraServices } = req.body;
    // 1️⃣ get booking
    const result = await pool.query(
      "SELECT * FROM bookings WHERE booking_id=$1",
      [bookingId]
    );

    const booking = result.rows[0];

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    let items = typeof booking.items === "string"
  ? JSON.parse(booking.items)
  : booking.items;

// ✅ ADD EXTRA SERVICES INTO ITEMS
if (extraServices && extraServices.length > 0) {
  const formattedExtras = extraServices.map(s => ({
    serviceName: s.name,
    quantity: s.qty,
    price: s.qty ? s.total / s.qty : s.total,
    total: s.total
  }));

  items = [...items, ...formattedExtras];
}

    // 2️⃣ calculate subtotal
    let subtotal = 0;

    items.forEach(s => {
      subtotal += Number(s.total || 0);
    });

    // 3️⃣ calculate GST (already included if you want skip)
    const gst = 0; // or calculate if needed

    // 4️⃣ final
    const finalTotal =
      subtotal +
      Number(extraCharges || 0) -
      Number(discount || 0) +
      gst;

    // 5️⃣ save bill
    // 5️⃣ check if bill already exists
const existing = await pool.query(
  "SELECT * FROM billing WHERE booking_id=$1",
  [bookingId]
);

if (existing.rows.length > 0) {
  return res.json({
    message: "Bill already generated",
    bill: existing.rows[0]
  });
}

// 6️⃣ save bill (only first time)
const save = await pool.query(
  `INSERT INTO billing
   (booking_id, owner_id, items, subtotal, extra_charges, discount, gst, final_total)
   VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
   RETURNING *`,
  [
    bookingId,
    booking.owner_id,
    JSON.stringify(items),
    subtotal,
    extraCharges || 0,
    discount || 0,
    gst,
    finalTotal
  ]
);

res.json({ bill: save.rows[0] });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Billing error" });
  }
};



exports.checkBill = async (req, res) => {
  const { bookingId } = req.params;

  const result = await pool.query(
    "SELECT * FROM billing WHERE booking_id=$1",
    [bookingId]
  );

  res.json({
  exists: result.rows.length > 0,
  bill: result.rows[0] || null
});
};