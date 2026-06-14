const crypto = require("crypto");
const razorpay = require("../utils/razorpay");
const pool = require("../config/db");


// =============================
// CREATE SUBSCRIPTION
// =============================
exports.createSubscription = async (req, res) => {

  try {

    const { ownerId, planName, amount } = req.body;

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    };

    const order =
      await razorpay.orders.create(options);

    res.status(200).json({
  success: true,
  order,
  key: process.env.RAZORPAY_KEY_ID
});

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Subscription creation failed"
    });
  }
};


// =============================
// VERIFY PAYMENT
// =============================
exports.verifyPayment = async (req, res) => {

  try {

    const {
      ownerId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      planName,
      amount,
      paymentType,
      months
    } = req.body;


    const sign =
      razorpay_order_id +
      "|" +
      razorpay_payment_id;

    const expectedSign = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(sign)
      .digest("hex");


    if (
      razorpay_signature !== expectedSign
    ) {

      return res.status(400).json({
        success: false,
        message: "Invalid Signature"
      });

    }



    // GET OWNER DATA
    const ownerResult =
      await pool.query(
        `
        SELECT
        owner_id,
        subscription_end
        FROM owners
        WHERE unique_id=$1
        `,
        [ownerId]
      );


    if (
      ownerResult.rows.length === 0
    ) {

      return res.status(404).json({
        success: false,
        message: "Owner not found"
      });

    }


    const actualOwnerId =
      ownerResult.rows[0].owner_id;



    // CHECK OLD SUBSCRIPTION
    let startDate =
      new Date();

    if (

      ownerResult.rows[0]
      .subscription_end &&

      new Date(
        ownerResult.rows[0]
        .subscription_end
      ) > new Date()

    ) {

      startDate =
      new Date(
      ownerResult.rows[0]
      .subscription_end
      );

    }


    // CALCULATE NEW END DATE
    const endDate =
      new Date(startDate);

    endDate.setMonth(
      endDate.getMonth() +
      months
    );



    // UPDATE OWNER
    await pool.query(
      `
      UPDATE owners
      SET
      subscription_plan=$1,
      subscription_status='active',
      payment_type=$2,
      subscription_start=$3,
      subscription_end=$4,
      account_locked=false

      WHERE unique_id=$5
      `,
      [
        planName,
        paymentType,
        startDate,
        endDate,
        ownerId
      ]
    );



    // SAVE HISTORY
    await pool.query(
      `
      INSERT INTO
      subscription_payments
      (
      owner_id,
      plan_name,
      payment_type,
      amount,
      razorpay_payment_id,
      razorpay_order_id,
      payment_status,
      start_date,
      end_date
      )

      VALUES
      (
      $1,$2,$3,$4,
      $5,$6,$7,
      $8,$9
      )
      `,
      [
        actualOwnerId,
        planName,
        paymentType,
        amount,
        razorpay_payment_id,
        razorpay_order_id,
        "success",
        startDate,
        endDate
      ]
    );


    return res.status(200).json({
      success: true,
      message: "Payment Verified"
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Verification Failed"
    });

  }

};


// =============================
// GET STATUS
// =============================
exports.getSubscriptionStatus =
async (req, res) => {

  try {

    const { ownerId } =
      req.params;


    const result =
      await pool.query(
        `
        SELECT
subscription_plan,
subscription_status,
payment_type,
subscription_start,
subscription_end,
account_locked,
autopay_status,
razorpay_subscription_id

        FROM owners

        WHERE unique_id=$1
        `,
        [ownerId]
      );


    res.status(200).json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message:
      "Failed to fetch subscription"
    });
  }
};


// =============================
// CREATE AUTOPAY
// =============================
exports.createAutoPaySubscription =
async (req, res) => {

  try {

    const {
      ownerId,
      planName
    } = req.body;


    let planId = "";


    if (planName === "Monthly") {
      planId =
      "plan_SOhSLOcXDsHFQP";
    }

    else if (
      planName === "3 Months"
    ) {
      planId =
      "plan_SOhVwpbSy0F1FN";
    }

    else if (
      planName === "6 Months"
    ) {
      planId =
      "plan_SOhWd99dbOwhdS";
    }

    else if (
      planName === "Yearly"
    ) {
      planId =
      "plan_SOhXPO2GNy3DCy";
    }


    const subscription =
      await razorpay
      .subscriptions.create({

      plan_id: planId,

      customer_notify: 1,

      total_count: 12

    });


    await pool.query(
`
UPDATE owners
SET
razorpay_subscription_id=$1,
payment_type='autopay',
autopay_status='active'

WHERE unique_id=$2
`,
[
subscription.id,
ownerId
]
);


    res.status(200).json({
  success: true,
  subscription,
  key: process.env.RAZORPAY_KEY_ID
});

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message:
      "Autopay creation failed"
    });
  }
};








// =============================
// CANCEL AUTOPAY
// =============================

exports.cancelAutoPay =
async(req,res)=>{

try{

const {ownerId}=req.body;

const result=
await pool.query(
`
SELECT
razorpay_subscription_id
FROM owners
WHERE unique_id=$1
`,
[ownerId]
);

if(
!result.rows[0]
?.razorpay_subscription_id
){

return res.status(404)
.json({
success:false,
message:
"No AutoPay found"
});

}

await razorpay
.subscriptions
.cancel(
result.rows[0]
.razorpay_subscription_id
);

await pool.query(
`
UPDATE owners
SET
autopay_status='cancelled'
WHERE unique_id=$1
`,
[ownerId]
);

res.json({
success:true,
message:
"AutoPay cancelled"
});

}catch(error){

console.log(error);

res.status(500)
.json({
success:false,
message:
"Cancel failed"
});

}

};