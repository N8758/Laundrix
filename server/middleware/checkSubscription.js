const pool = require("../config/db");

const jwt = require("jsonwebtoken");

const checkSubscription = async (req, res, next) => {

  try {

    const header = req.headers.authorization || "";



    // CHECK TOKEN
    if (!header.startsWith("Bearer ")) {

      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }



    const token = header.replace("Bearer ", "");

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );



    const ownerID = decoded.ownerID;



    // CHECK OWNER
    const result = await pool.query(
      `
      SELECT account_locked
      FROM owners
      WHERE unique_id = $1
      `,
      [ownerID]
    );



    if (result.rows.length === 0) {

      return res.status(404).json({
        success: false,
        message: "Owner not found"
      });
    }



    // BLOCK SYSTEM
    if (result.rows[0].account_locked) {

      return res.status(403).json({
        success: false,
        locked: true,
        message: "Subscription expired. Please renew."
      });
    }



    next();

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

module.exports = checkSubscription;