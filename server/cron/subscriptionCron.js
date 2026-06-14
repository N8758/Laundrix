const cron = require("node-cron");
const pool = require("../config/db");

cron.schedule("0 0 * * *", async () => {

  try {

    await pool.query(`
    
      UPDATE owners
      SET
      account_locked = true,
      subscription_status = 'expired'

      WHERE

      (

      (
      subscription_end IS NOT NULL
      AND subscription_end < NOW()
      )

      OR

      (
      trial_end_date IS NOT NULL
      AND trial_end_date < NOW()
      )

      )

    `);

    console.log(
      "Expired subscriptions and trials locked"
    );

  } catch (error) {

    console.log(error);

  }

});