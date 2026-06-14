const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");

// CUSTOMER → SUBMIT FEEDBACK
exports.submitFeedback = async (req, res) => {
  try {
    const { ownerId, name, services, rating, suggestion } = req.body;

    // ✅ validation
    if (!ownerId || !name || !services || services.length === 0) {
      return res.status(400).json({
        message: "ownerId, name, services required"
      });
    }

    if (!rating || rating < 1 || rating > 5) {
  return res.status(400).json({
    message: "Rating must be between 1 and 5"
  });
}

    const id = uuidv4();

    // ✅ convert array → string (NO DB CHANGE NEEDED)
    const serviceString = services.join(",");
    const customerId = req.user?.customerId;

    await pool.query(
      `INSERT INTO feedbacks 
(id, owner_id, customer_id, name, service, rating, suggestion, status, created_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,'pending',NOW())`,
      

[id, ownerId, customerId, name, serviceString, rating, suggestion]
    );

    res.json({
      message: "Feedback submitted",
      feedback: {
        id,
        ownerId,
        name,
        services, // send back array
        rating,
        suggestion,
        status: "pending"
      }
    });

  } catch (err) {
    console.error("Submit feedback error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
// OWNER → GET ALL FEEDBACK FOR THAT OWNER
exports.getFeedbacksByOwner = async (req, res) => {
  try {
    const { ownerId } = req.params;

    const result = await pool.query(
      "SELECT * FROM feedbacks WHERE owner_id=$1 AND is_deleted=false" ,
      [ownerId]
    );

    // ✅ convert string → array
    const feedbacks = result.rows.map(f => ({
      ...f,
      services: f.service ? f.service.split(",") : []
    }));

    res.json({ feedbacks });

  } catch (err) {
    console.error("Get feedback error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
// OWNER → APPROVE FEEDBACK
exports.approveFeedback = async (req, res) => {
  try {
    const { ownerId, feedbackId } = req.params;

    const result = await pool.query(
      "UPDATE feedbacks SET status='approved' WHERE id=$1 AND owner_id=$2 AND is_deleted=false RETURNING *",
      [feedbackId, ownerId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json({ message: "Approved", feedback: result.rows[0] });

  } catch (err) {
    console.error("Approve feedback error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// OWNER → DELETE FEEDBACK
exports.deleteFeedback = async (req, res) => {
  try {
    const { ownerId, feedbackId } = req.params;

    const result = await pool.query(
      "UPDATE feedbacks SET is_deleted=true WHERE id=$1 AND owner_id=$2 AND is_deleted=false RETURNING *",
      [feedbackId, ownerId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json({ message: "Deleted" });

  } catch (err) {
    console.error("Delete feedback error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// CUSTOMER → GET ONLY APPROVED FEEDBACK
exports.getApprovedFeedback = async (req, res) => {
  try {
    const { ownerId } = req.params;

    const result = await pool.query(
  "SELECT * FROM feedbacks WHERE owner_id=$1 AND status='approved' AND is_deleted=false",
  [ownerId]
);

    res.json({ feedbacks: result.rows });

  } catch (err) {
    console.error("Approved feedback error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
