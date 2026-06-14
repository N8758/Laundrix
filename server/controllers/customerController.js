const pool = require("../config/db");
const jwt = require("jsonwebtoken");

const sendWhatsAppSimulator = require("../utils/sendWhatsAppSimulator");

function generateCustomerToken(mobile, name) {
  return jwt.sign({ customerMobile: mobile, customerName: name }, process.env.JWT_SECRET, {
    expiresIn: "2d",
  });
}

function getCustomerFromToken(req) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    return null;
  }
}

// POST /api/customer/request-otp  { mobile, name }
// Generates a 4-digit OTP and stores it in data.json.tempOtps
exports.requestOtp = async (req, res) => {
  try {
    const { mobile, name } = req.body;

if (!mobile) {
  return res.status(400).json({
    message: "Mobile required"
  });
}

if (!/^[6-9]\d{9}$/.test(mobile)) {
  return res.status(400).json({
    message: "Enter valid 10 digit mobile number"
  });
}

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    await pool.query(
  `INSERT INTO customer_otps (mobile, otp, expires_at)
   VALUES ($1,$2, NOW() + INTERVAL '5 minutes')
   ON CONFLICT (mobile)
   DO UPDATE SET otp=$2, expires_at=NOW() + INTERVAL '5 minutes', created_at=NOW()`,
  [mobile, otp]
);

    await sendWhatsAppSimulator(
    mobile,
    "otp_cutomer",
    [otp]
);

res.json({
   message: "OTP sent successfully"
});

  } catch (err) {
    console.error("OTP request error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/customer/verify-otp  { mobile, otp }
// Returns JWT token on success
exports.verifyOtp = async (req, res) => {
  try {
    const { mobile, otp, name } = req.body;

    if (!mobile || !otp) {
      return res.status(400).json({ message: "mobile and otp required" });
    }

    const result = await pool.query(
      "SELECT * FROM customer_otps WHERE mobile=$1",
      [mobile]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid OTP" });
    }

    const record = result.rows[0];

    if (new Date(record.expires_at) < new Date()) {
  return res.status(401).json({ message: "OTP expired" });
}

    if (record.otp !== String(otp)) {
      return res.status(401).json({ message: "Invalid OTP" });
    }

    await pool.query(
      "DELETE FROM customer_otps WHERE mobile=$1",
      [mobile]
    );

    // save customer in DB and get customer_id
const result2 = await pool.query(
  `INSERT INTO customers (mobile, name)
   VALUES ($1, $2)
   ON CONFLICT (mobile)
   DO UPDATE SET name=$2
   RETURNING customer_id`,
  [mobile, name || ""]
);

const customerId = result2.rows[0].customer_id;

// create token with customer_id
const token = jwt.sign(
  {
    customerMobile: mobile,
    customerName: name,
    customerId: customerId
  },
  process.env.JWT_SECRET,
  { expiresIn: "2d" }
);

    res.json({ message: "OTP verified", token });

  } catch (err) {
    console.error("OTP verify error:", err);
    res.status(500).json({ message: "Server error" });
  }
};




// GET /api/customer/owner/:id  - get owner by uniqueID
exports.getOwnerById = async (req, res) => {
  try {
    const { id } = req.params;

   const result = await pool.query(
  `SELECT 
    owner_id,

    owner_name,
    email,
    mobile,
    unique_id,
    qr_code_data_url,
    shop_name,
    address,
    door_enabled,
    door_charge
   FROM owners 
WHERE unique_id=$1 OR email=$1`,
  [id]
);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Owner not found" });
    }

    const owner = result.rows[0];
    delete owner.password;

    res.json({ owner });

  } catch (err) {
    console.error("Get owner error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/customer/owner/:id/services - list owner services
exports.getOwnerServices = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT 
        id,
        title,
         category,
        pricing_type AS "pricingType",
        price_per_kg AS "pricePerKg",
        item_prices AS "itemPrices",
        description AS "desc",
        image_url AS "imageUrl",
        gst
      FROM services
      WHERE owner_id=$1 AND is_active=true`,
      [id]
    );

    res.json({ services: result.rows });

  } catch (err) {
    console.error("Get services error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/customer/me
exports.getMe = async (req, res) => {
  try {
    const payload = getCustomerFromToken(req);

    if (!payload) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const result = await pool.query(
  "SELECT name, email, mobile, address, latitude, longitude FROM customers WHERE customer_id=$1",
  [payload.customerId]
);

    const dbUser = result.rows[0];

    res.json({
      customer: {
  mobile: payload.customerMobile,
  name: dbUser?.name || payload.customerName,
  email: dbUser?.email || "",
  address: dbUser?.address || "",
  latitude: dbUser?.latitude || null,
  longitude: dbUser?.longitude || null
}
    });

  } catch (err) {
    console.error("Get customer error:", err);
    res.status(500).json({ message: "Server error" });
  }
};





exports.updateCustomerProfile = async (req, res) => {
  try {
    const payload = getCustomerFromToken(req);

    if (!payload) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const customerId = payload.customerId;

    const { name, email, address, latitude, longitude } = req.body;

    const result = await pool.query(
      `UPDATE customers
       SET name=$1,
           email=$2,
           address=$3,
           latitude=$4,
           longitude=$5
       WHERE customer_id=$6
       RETURNING *`,
      [name, email, address, latitude, longitude, customerId]
    );

    res.json({
      message: "Customer profile updated successfully",
      customer: result.rows[0],
    });

  } catch (err) {
    console.error("Customer profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};