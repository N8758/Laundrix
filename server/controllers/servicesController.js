const pool = require("../config/db");
const { getOwnerID } = require("./ownerController");

const fs = require("fs");

/* -------------------------------------------
   ADD / EDIT / DELETE SERVICES
--------------------------------------------*/
exports.manageServices = async (req, res) => {
  try {
    console.log("========== SERVICE REQUEST ==========");
    console.log("ownerID:", getOwnerID(req));
    console.log("action:", req.body.action);
    console.log("body:", req.body);
    console.log("service:", req.body.service);
    console.log("file:", req.file);
    const ownerID = getOwnerID(req);
    if (!ownerID) return res.status(401).json({ message: "Unauthorized" });

    const action = req.body.action;

const service =
  typeof req.body.service === "string"
    ? JSON.parse(req.body.service)
    : req.body.service || {};


const imagePath = req.file
  ? req.file.path.replace(/\\/g, "/")
  : service.imageUrl;
    if (!action) return res.status(400).json({ message: "Action required" });

    /* ---------- ADD SERVICE ---------- */
    if (action === "add") {
      const id = `SVC${Date.now()}`;

      

      await pool.query(
        `INSERT INTO services
(id, owner_id, title, category, pricing_type, price_per_kg, item_prices, description, image_url,gst, is_active)
VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
       [
  id,
  ownerID,
  service.title,
  service.category || "General",
  service.pricingType,
  service.pricingType === "perKg" ? Number(service.pricePerKg) : null,
  service.pricingType === "perItem" ? JSON.stringify(service.itemPrices) : null,
  service.desc || "",
  imagePath || "",
  service.gst || 0,
  true
]

      );

      return res.json({ message: "Service added", id });
    }

    /* ---------- EDIT SERVICE ---------- */
    if (action === "edit") {
      const result = await pool.query(
        `UPDATE services
         SET title=$1,
    category=$2,
    pricing_type=$3,
    price_per_kg=$4,
    item_prices=$5,
    description=$6,
    image_url=$7,
     gst=$8
WHERE id=$9 AND owner_id=$10`,
        [
  service.title,
  service.category || "General",
  service.pricingType,
  service.pricingType === "perKg" ? Number(service.pricePerKg) : null,
  service.pricingType === "perItem" ? JSON.stringify(service.itemPrices) : null,
  service.desc || "",
  imagePath || "",
  service.gst || 0,
  service.id,
  ownerID
]

      );

      if (result.rowCount === 0) {
        return res.status(404).json({ message: "Service not found" });
      }

      return res.json({ message: "Service updated" });
    }

    /* ---------- DELETE SERVICE ---------- */
    if (action === "delete") {
      const result = await pool.query(
        "UPDATE services SET is_active=false WHERE id=$1 AND owner_id=$2",
        [service.id, ownerID]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ message: "Service not found" });
      }

      return res.json({ message: "Service deleted" });
    }

    res.status(400).json({ message: "Invalid action" });

  } catch (err) {

  console.log("========== SERVICE ERROR ==========");
  console.log(err);
  console.log("MESSAGE:", err.message);
  console.log("STACK:", err.stack);
  console.log("===================================");

  return res.status(500).json({
    success: false,
    error: err.message
  });
}
};



exports.getOwnerServices = async (req, res) => {
  try {

    const ownerID = getOwnerID(req);

    if (!ownerID) {
      return res.status(401).json({ message: "Unauthorized" });
    }

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
      [ownerID]
    );

    res.json({ services: result.rows });

  } catch (err) {
    console.error("Get services error:", err);
    res.status(500).json({ message: "Server error" });
  }
};