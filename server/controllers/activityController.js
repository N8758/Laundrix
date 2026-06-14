const pool = require("../config/db");

exports.updateOwnerActivity = async (ownerId) => {

  try {

    await pool.query(
      `
      UPDATE owners
      SET last_active = NOW(),
          usage_status = 'active'
      WHERE owner_id = $1
      `,
      [ownerId]
    );

  } catch (err) {

    console.log("Activity update error");

  }

};