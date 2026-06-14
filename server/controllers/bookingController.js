const pool = require("../config/db");
const sendWhatsAppSimulator = require("../utils/sendWhatsAppSimulator");

/* ================= CUSTOMER → CREATE BOOKING ================= */
exports.createBooking = async (req, res) => {
  try {
  const {
  ownerId,
  services,   // ✅ NEW
  customerAddress,
  pickupType,
  deliveryCharge
} = req.body;

  const jwt = require("jsonwebtoken");


// ✅ check header
const authHeader = req.headers.authorization;

if (!authHeader) {
  return res.status(401).json({ message: "No token provided" });
}

const token = authHeader.split(" ")[1];

let payload;
try {
  payload = jwt.verify(token, process.env.JWT_SECRET);
} catch (err) {
  return res.status(401).json({ message: "Invalid token" });
}
const customerMobile = payload.customerMobile;



// ✅ check customerId
if (!payload.customerId) {
  return res.status(400).json({ message: "customerId missing in token" });
}

// ✅ get customer from DB
const user = await pool.query(
  "SELECT name, address, latitude, longitude FROM customers WHERE customer_id=$1",
  [payload.customerId]
);

if (user.rows.length === 0) {
  return res.status(404).json({ message: "Customer not found" });
}

const customerName = user.rows[0].name;

const dbAddress = user.rows[0].address;
const dbLat = user.rows[0].latitude;
const dbLng = user.rows[0].longitude;

// priority: booking address > profile address
const finalAddress = customerAddress || dbAddress;


  if (!ownerId || !services || !pickupType) {
    return res.status(400).json({ message: "Missing data" });
  }

let finalTotal = 0;
let bookingStatus = pickupType === "door" ? "assigned" : "accepted";
let allServicesData = [];

for (const s of services) {

  // ✅ check same owner
  const checkOwner = await pool.query(
    "SELECT owner_id, pricing_type, price_per_kg, item_prices, gst FROM services WHERE id=$1",
    [s.serviceId]
  );

  const service = checkOwner.rows[0];


  if (!service) {
  return res.status(404).json({ message: "Service not found" });
}

  if (service.owner_id !== ownerId) {
    return res.status(400).json({
      message: "All services must belong to same owner"
    });
  }

  let serviceTotal = 0;

  // 🔥 PER KG
  if (service.pricing_type === "perKg") {
    bookingStatus = "pending_weight";
  }

  // 🔥 PER ITEM
  if (service.pricing_type === "perItem") {
    const itemPrices =
      typeof service.item_prices === "string"
        ? JSON.parse(service.item_prices)
        : service.item_prices;

    serviceTotal = s.items.reduce((sum, item) => {
      const found = itemPrices.find(
  i => i.item.trim().toLowerCase() === item.name.trim().toLowerCase()
);
      const price = found ? Number(found.price) : 0;

      return sum + price * Number(item.quantity || 0);
    }, 0);
  }

  // ✅ ADD GST
const gstPercent = Number(service.gst || 0);
const gstAmount = (serviceTotal * gstPercent) / 100;

serviceTotal += gstAmount;

// ✅ ADD TO FINAL
finalTotal += serviceTotal;

  allServicesData.push({
    serviceId: s.serviceId,
    serviceName: s.serviceName,
    items: service.pricing_type === "perKg" ? null : s.items,
    weight: null,
    total: serviceTotal,
    price_per_kg: service.price_per_kg || 0 ,
    gst: service.gst || 0 
  });
}

  

  const finalDeliveryCharge = pickupType === "door" ? Number(deliveryCharge || 0) : 0;

  finalTotal += finalDeliveryCharge;
  

  const booking = {
    
    ownerId,
   items: allServicesData,
   latitude: dbLat || req.body.latitude,
longitude: dbLng || req.body.longitude,
    
    pickupType, // self or door
    deliveryCharge: finalDeliveryCharge,
    totalPrice: finalTotal,
    weight: null,
    customerName,
    customerMobile,
    customerAddress: finalAddress,
    status: bookingStatus,
    pickupDateTime: null,
    completionDateTime: null,
    hiddenForCustomer: false,
    hiddenForOwner: false,
    createdAt: new Date().toISOString()
  };

 await pool.query(
`INSERT INTO bookings
(owner_id, items, pickup_type, delivery_charge, total_price, weight,
customer_id, customer_name, customer_mobile, customer_address,latitude, longitude,  status,
pickup_datetime, completion_datetime, hidden_for_customer, hidden_for_owner, created_at)
VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)`,
[
booking.ownerId,
JSON.stringify(booking.items),
booking.pickupType,
booking.deliveryCharge,
booking.totalPrice,
booking.weight,
payload.customerId,
booking.customerName,
booking.customerMobile,
booking.customerAddress,
booking.latitude,      
booking.longitude,
booking.status,
booking.pickupDateTime,
booking.completionDateTime,
booking.hiddenForCustomer,
booking.hiddenForOwner,
booking.createdAt
]
);

  res.json({ message: "Booking successful", booking });

  } catch (err) {
    console.error("Create booking error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= OWNER → VIEW BOOKINGS ================= */
exports.getOwnerBookings = async (req, res) => {
  try {
    const { ownerId } = req.params;

    const result = await pool.query(
      `SELECT booking_id AS "bookingId",
        owner_id AS "ownerId",
        
        items,
        pickup_type AS "pickupType",
        delivery_charge AS "deliveryCharge",
        total_price AS "totalPrice",
        customer_name AS "customerName",
customer_mobile AS "customerMobile",
customer_address AS "customerAddress",

bookings.latitude,
bookings.longitude,

cancel_reason AS "cancelReason",
reschedule_reason AS "rescheduleReason",

customer_cancel_reason AS "customerCancelReason",
customer_reschedule_reason AS "customerRescheduleReason",

customer_cancel_request AS "customerCancelRequest",
customer_reschedule_request AS "customerRescheduleRequest",

status,
pickup_datetime AS "pickupDateTime",
        completion_datetime AS "completionDateTime",
        created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata' AS "createdAt"
      FROM bookings
      WHERE owner_id=$1 AND hidden_for_owner=false
      ORDER BY created_at DESC`,
      [ownerId]
    );

    const bookings = result.rows.map(b => ({
      ...b,
      items: typeof b.items === "string" ? JSON.parse(b.items) : b.items
    }));

    res.json({ bookings });

  } catch (err) {
    console.error("Owner bookings error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
/* ================= CUSTOMER → VIEW BOOKINGS ================= */
exports.getCustomerBookings = async (req, res) => {
  try {
    const jwt = require("jsonwebtoken");

const authHeader = req.headers.authorization;
if (!authHeader) {
  return res.status(401).json({ message: "No token" });
}

const token = authHeader.split(" ")[1];
const payload = jwt.verify(token, process.env.JWT_SECRET);


const { ownerId } = req.params;
    

    const result = await pool.query(
      `SELECT booking_id AS "bookingId",
        owner_id AS "ownerId",
        
        items,
        pickup_type AS "pickupType",
        delivery_charge AS "deliveryCharge",
        total_price AS "totalPrice",
        customer_name AS "customerName",
        customer_address AS "customerAddress",
        latitude,
        longitude,
        cancel_reason AS "cancel_reason",
reschedule_reason AS "reschedule_reason",
        status,
        pickup_datetime AS "pickupDateTime",
        completion_datetime AS "completionDateTime",
        created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata' AS "createdAt"
      FROM bookings
WHERE customer_id=$1
AND owner_id=$2
 AND hidden_for_customer=false
ORDER BY created_at DESC`,
     [payload.customerId, ownerId]
    );

    const bookings = result.rows.map(b => ({
      ...b,
      items: typeof b.items === "string" ? JSON.parse(b.items) : b.items
    }));

    res.json({ bookings });

  } catch (err) {
    console.error("Customer bookings error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
/* ================= CUSTOMER → HIDE BOOKING ================= */
exports.hideCustomerBooking = async (req, res) => {
  const { bookingId } = req.params;

  await pool.query(
    "UPDATE bookings SET hidden_for_customer=true WHERE booking_id=$1",
    [bookingId]
  );

  res.json({ message: "Booking hidden for customer" });
};

/* ================= OWNER → CONFIRM BOOKING ================= */
exports.confirmBooking = async (req, res) => {
  try {
    const { bookingId, pickupDateTime } = req.body;
    if (new Date(pickupDateTime) <= new Date()) {
  return res.status(400).json({
    message: "Pickup date and time must be in the future"
  });
}

    const result = await pool.query(
      `SELECT b.customer_name,
       b.customer_mobile,
       o.shop_name
       FROM bookings b
       JOIN owners o ON b.owner_id = o.unique_id
       WHERE b.booking_id=$1`,
      [bookingId]
    );

    const customerName = result.rows[0]?.customer_name || "Customer";
    const shopName = result.rows[0]?.shop_name || "Laundry";

   // 🔥 get pickupType + pricing_type




let newStatus = "accepted"; // default (per item)

// ✅ ONLY for DOOR + KG


await pool.query(
  "UPDATE bookings SET status=$1, pickup_datetime=$2 WHERE booking_id=$3",
  [newStatus, pickupDateTime, bookingId]
);

   const formattedDate = new Date(pickupDateTime).toLocaleString("en-IN", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "numeric",
  minute: "2-digit",
  hour12: true
});

await sendWhatsAppSimulator(
  result.rows[0].customer_mobile,
  "pickup_schedule_notification",
  [
    customerName,
    shopName,
    formattedDate
  ]
);

    res.json({ message: "Booking confirmed" });

  } catch (err) {
    console.error("Confirm booking error:", err);
    res.status(500).json({ message: "Server error" });
  }
};




exports.completeBooking = async (req, res) => {
  try {

    const { bookingId, completionDateTime } = req.body;

    if (new Date(completionDateTime) <= new Date()) {
  return res.status(400).json({
    message: "Completion date and time must be in the future"
  });
}

    const result = await pool.query(
`
SELECT
    b.customer_name,
    b.customer_mobile,
    b.delivery_staff_id,
    s.name AS staff_name,
    o.mobile AS owner_mobile,
    o.shop_name
FROM bookings b
JOIN owners o
ON b.owner_id = o.unique_id
LEFT JOIN staff s
ON b.delivery_staff_id = s.staff_id
WHERE b.booking_id = $1
`,
[bookingId]
);
    const customerName = result.rows[0]?.customer_name || "Customer";
    const shopName = result.rows[0]?.shop_name || "Laundry";

    // Get pickup type
const bookingData = await pool.query(
  "SELECT pickup_type FROM bookings WHERE booking_id=$1",
  [bookingId]
);

const newStatus =
  bookingData.rows[0].pickup_type === "self"
    ? "completed"
    : "processing";

await pool.query(
  "UPDATE bookings SET status=$1, completion_datetime=$2 WHERE booking_id=$3",
  [newStatus, completionDateTime, bookingId]
);

   const formattedDate = new Date(completionDateTime).toLocaleString("en-IN");

if (bookingData.rows[0].pickup_type === "self") {

  await sendWhatsAppSimulator(
    result.rows[0].customer_mobile,
    "order_completed_self",
    [
      customerName,
      shopName,
      formattedDate
    ]
  );

} else {

  await sendWhatsAppSimulator(
    result.rows[0].customer_mobile,
    "order_completed_door",
    [
      customerName,
      shopName,
      formattedDate
    ]
  );

}

    res.json({ message: "Booking completed" });

  } catch (err) {
    console.error("Complete booking error:", err);
    res.status(500).json({ message: "Server error" });
  }
};




/* ================= OWNER → HIDE BOOKING ================= */
exports.hideOwnerBooking = async (req, res) => {
  try {
  const { bookingId } = req.params;

  await pool.query(
    "UPDATE bookings SET hidden_for_owner=true WHERE booking_id=$1",
    [bookingId]
  );

  res.json({ message: "Booking hidden for owner" });
   } catch (err) {
    console.error("Hide owner booking error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= OWNER → DASHBOARD STATS ================= */
exports.getOwnerStats = async(req, res) => {
  try {

  const { ownerId } = req.params;
  const result = await pool.query(
  "SELECT * FROM bookings WHERE owner_id=$1 AND status='accepted' AND hidden_for_owner=false",
  [ownerId]
);

const bookings = result.rows;

  const today = new Date();
  const last7Days = [];

  // Prepare last 7 dates
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10); // YYYY-MM-DD

    last7Days.push({
      date: dateStr,
      revenue: 0,
      bookings: 0
    });
  }

  bookings.forEach(b => {
  if (
    b.owner_id !== ownerId ||
    b.status !== "accepted" ||
    b.hidden_for_owner
  ) return;

  const bookingDate = b.created_at.toISOString().slice(0, 10);

  const day = last7Days.find(d => d.date === bookingDate);
  if (day) {
    day.revenue += Number(b.total_price || 0);
    day.bookings += 1;
  }
});

  res.json({ stats: last7Days });

  } catch (err) {
    console.error("Owner stats error:", err);
    res.status(500).json({ message: "Server error" });
  }
};




// cancel by owner ok

exports.cancelBooking = async (req, res) => {
  const { bookingId } = req.params;
  const { reason } = req.body;

  const result = await pool.query(
    `SELECT b.customer_name,
       b.customer_mobile,
       o.shop_name
     FROM bookings b
     JOIN owners o ON b.owner_id = o.unique_id
     WHERE b.booking_id=$1`,
    [bookingId]
  );

  const customerName = result.rows[0]?.customer_name || "Customer";
  const customerMobile = result.rows[0]?.customer_mobile;
  const shopName = result.rows[0]?.shop_name || "Laundry";

  await pool.query(
    `UPDATE bookings
     SET status='cancelled',
         cancel_reason=$1
     WHERE booking_id=$2`,
    [reason, bookingId]
  );

  await sendWhatsAppSimulator(
  customerMobile,
  "booking_cancelled_owner",
  [
    customerName,
    shopName,
    reason
  ]
);

  res.json({ message: "Booking cancelled" });
};


//redule by owner

exports.rescheduleBooking = async (req, res) => {
  const { bookingId } = req.params;
  const { newDate, reason } = req.body;

  if (new Date(newDate) <= new Date()) {
  return res.status(400).json({
    message: "Please select a future date and time"
  });
}

  const result = await pool.query(
    `SELECT b.customer_name,
       b.customer_mobile,
       b.created_at,
       o.shop_name
     FROM bookings b
     JOIN owners o ON b.owner_id = o.unique_id
     WHERE b.booking_id=$1`,
    [bookingId]
  );

  const customerName = result.rows[0]?.customer_name || "Customer";
  const customerMobile = result.rows[0]?.customer_mobile;
  const oldDate = result.rows[0]?.created_at;
  const shopName = result.rows[0]?.shop_name || "Laundry";

  const formattedOldDate = new Date(oldDate).toLocaleString("en-IN", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "numeric",
  minute: "2-digit",
  hour12: true
});

const formattedNewDate = new Date(newDate).toLocaleString("en-IN", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "numeric",
  minute: "2-digit",
  hour12: true
});



  await pool.query(
`UPDATE bookings
 SET created_at=$1,
     reschedule_reason=$2
 WHERE booking_id=$3`,
[newDate, reason, bookingId]
);
  await sendWhatsAppSimulator(
  customerMobile,
  "booking_rescheduled_owner",
  [
    customerName,
    shopName,
    formattedOldDate,
    formattedNewDate,
    reason
  ]
);

  res.json({ message: "Booking rescheduled" });
};




exports.updateWeight = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { serviceIndex, weight } = req.body;

    const result = await pool.query(
      "SELECT items, delivery_charge, pickup_type FROM bookings WHERE booking_id=$1",
      [bookingId]
    );

    if (result.rows.length === 0) {
  return res.status(404).json({ message: "Booking not found" });
}

    let items = result.rows[0].items;
    const deliveryCharge = result.rows[0].delivery_charge || 0;

    // update correct service
    items = items.map((s, i) => {
  if (i == serviceIndex) {
    return {
      ...s,
      weight: Number(weight)
    };
  }

  return s;
});

    // calculate total
    

    

let total = Number(deliveryCharge || 0);

items.forEach(s => {

  // ✅ PER ITEM
  if (Array.isArray(s.items) && s.items.length > 0) {
    total += Number(s.total || 0);
  }

  // ✅ PER KG (ONLY USE WEIGHT, IGNORE s.total)
  else {
  const w = Number(s.weight || 0);
  const price = Number(s.price_per_kg || 0);

  const base = w * price;

  const gstPercent = Number(s.gst || 0);
  const gstAmount = (base * gstPercent) / 100;

  total += Number((base + gstAmount).toFixed(2));
}
});
    const allWeightsEntered = items.every(s => {
  // per item → already complete
  if (s.items && s.items.length > 0) return true;

  // per kg → must have weight
  return s.weight !== null && s.weight !== undefined;
});

let status;

if (result.rows[0].pickup_type === "self") {
  status = allWeightsEntered ? "accepted" : "pending_weight";
} else {
  status = allWeightsEntered ? "accepted" : "assigned";
}

    await pool.query(
      `UPDATE bookings 
       SET items=$1, total_price=$2, status=$3
       WHERE booking_id=$4`,
      [JSON.stringify(items), total, status, bookingId]
    );

    res.json({ message: "Weight updated", total });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating weight" });
  }
};





// ✅ OWNER → ASSIGN STAFF
exports.assignStaff = async (req, res) => {
  try {
    const { bookingId, staff_id, type } = req.body;

    if (!bookingId || !staff_id || !type) {
      return res.status(400).json({ message: "bookingId, staff_id and type required" });
    }

    // ✅ PICKUP STAFF
    if (type === "pickup") {
      await pool.query(
        `UPDATE bookings 
         SET pickup_staff_id = $1, status = 'assigned'
         WHERE booking_id = $2`,
        [staff_id, bookingId]
      );
    }

    // ✅ DELIVERY STAFF
    if (type === "delivery") {
      await pool.query(
        `UPDATE bookings 
         SET delivery_staff_id = $1, status = 'processing'
         WHERE booking_id = $2`,
        [staff_id, bookingId]
      );
    }

    res.json({ message: "Staff assigned successfully" });

  } catch (err) {
    console.error("Assign staff error:", err);
    res.status(500).json({ message: "Server error" });
  }
};



exports.getStaffBookings = async (req, res) => {
  try {
   
    const { staffId } = req.params;

    const result = await pool.query(
      `SELECT 
        booking_id,
        customer_name,
        customer_mobile,
        customer_address,
        latitude,
        longitude,
        pickup_type,
        status,
        total_price,
        pickup_datetime,
        completion_datetime,
        delivery_staff_id,
        items
      FROM bookings
      WHERE
(
  pickup_staff_id = $1
  AND status IN ('assigned','accepted')
)
OR
(
  delivery_staff_id = $1
  AND status IN ('processing','delivered')
)
      ORDER BY created_at DESC`,
      [staffId]
    );

    const bookings = result.rows.map(b => ({
      ...b,
      items: typeof b.items === "string" ? JSON.parse(b.items) : b.items
    }));

    

    res.json({ bookings });

  } catch (err) {
    console.error("Staff bookings error:", err);
    res.status(500).json({ message: "Server error" });
  }
};









exports.customerCancelRequest = async(req,res)=>{
try{

const {bookingId}=req.params;
const {reason}=req.body;

const result=await pool.query(
`
SELECT b.customer_name,
       b.customer_mobile,
       o.shop_name,
       o.mobile AS owner_mobile

FROM bookings b
JOIN owners o
ON b.owner_id=o.unique_id

WHERE b.booking_id=$1
`,
[bookingId]
);

const customer=result.rows[0];

await pool.query(
`
UPDATE bookings
SET customer_cancel_request=true,
    customer_cancel_reason=$1,
    status='cancelled'
WHERE booking_id=$2
`,
[
  reason,
  bookingId
]
);


// WhatsApp simulator

await sendWhatsAppSimulator(
   customer.owner_mobile,
  "customer_cancel_request",
  [
    customer.customer_name,
    customer.customer_mobile,
    bookingId,
    reason
  ]
);

res.json({
message:"Cancel request sent to owner"
});

}catch(err){

console.log(err);

res.status(500).json({
message:"Server Error"
});

}
};










exports.customerRescheduleRequest=async(req,res)=>{
try{

const {bookingId}=req.params;

const{
newDate,
reason
}=req.body;


if (new Date(newDate) <= new Date()) {
  return res.status(400).json({
    message: "Please select a future date and time"
  });
}

const result=await pool.query(
`
SELECT b.customer_name,
       b.customer_mobile,
       b.status,
       b.completion_datetime,
b.pickup_datetime,
       o.shop_name,
       o.mobile AS owner_mobile

FROM bookings b
JOIN owners o
ON b.owner_id=o.unique_id

WHERE b.booking_id=$1
`,
[bookingId]
);


const customer=result.rows[0];

const bookingStatus = customer.status;


const oldDate =
  bookingStatus === "processing" ||
  bookingStatus === "delivered"
    ? customer.completion_datetime
    : customer.pickup_datetime;

const formattedOldDate = new Date(oldDate).toLocaleString("en-IN", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

const formattedNewDate = new Date(newDate).toLocaleString("en-IN", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});



if (
  bookingStatus === "processing" ||
  bookingStatus === "delivered"
) {

  await pool.query(
    `
    UPDATE bookings
    SET customer_reschedule_request=true,
        completion_datetime=$1,
        customer_reschedule_reason=$2,
        delivery_staff_id=NULL,
        status='processing'
    WHERE booking_id=$3
    `,
    [newDate, reason, bookingId]
  );

} else {

  await pool.query(
    `
    UPDATE bookings
    SET customer_reschedule_request=true,
        pickup_datetime=$1,
        customer_reschedule_reason=$2,
        pickup_staff_id=NULL,
        status='assigned'
    WHERE booking_id=$3
    `,
    [newDate, reason, bookingId]
  );

}


// WhatsApp simulator

await sendWhatsAppSimulator(
  customer.owner_mobile,
  "customer_reschedule_request_v2",
  [
    customer.customer_name,
    customer.customer_mobile,
    bookingId,
    formattedOldDate,
    formattedNewDate,
    reason
  ]
);

res.json({
message:"Reschedule request sent to owner"
});

}catch(err){

console.log(err);

res.status(500).json({
message:"Server Error"
});

}
};




exports.completeDelivery = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const result = await pool.query(
      `SELECT
          b.customer_name,
          b.customer_mobile,
          b.delivery_staff_id,
    s.name AS staff_name,
          o.mobile AS owner_mobile,
          o.shop_name
       FROM bookings b
       JOIN owners o
       ON b.owner_id = o.unique_id
       LEFT JOIN staff s
ON b.delivery_staff_id = s.staff_id
       WHERE b.booking_id = $1`,
      [bookingId]
    );

    const customerName = result.rows[0].customer_name;
    const customerMobile = result.rows[0].customer_mobile;
    const ownerMobile = result.rows[0].owner_mobile;
    const shopName = result.rows[0].shop_name;
    const staffName =
  result.rows[0].staff_name || "Staff";

    await pool.query(
      "UPDATE bookings SET status='delivered' WHERE booking_id=$1",
      [bookingId]
    );

    // Customer Message
    await sendWhatsAppSimulator(
      customerMobile,
      "delivery_completed",
      [
        customerName,
        shopName,
        
      ]
    );

    // Owner Message
    await sendWhatsAppSimulator(
      ownerMobile,
      "delivery_completed_owner",
      [
        customerName,
        shopName,
        staffName
      ]
    );

    res.json({
      message: "Delivery completed"
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server Error"
    });
  }
};