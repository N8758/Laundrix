// server/controllers/ownerController.js
const pool = require("../config/db");
const jwt = require("jsonwebtoken");

/* -------------------------------------------
   Helper: Extract owner ID from token
--------------------------------------------*/
exports.getOwnerID = (req) => {
  const header = req.headers.authorization || "";
  if (!header.startsWith("Bearer ")) return null;

  try {
    const token = header.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.ownerID;
  } catch {
    return null;
  }
};

/* -------------------------------------------
   REGISTER OWNER (Pending)
--------------------------------------------*/
exports.registerOwner = async (req, res) => {
  try {
    const {
ownerName,
shopName,
businessEmail,
mobile,
password,
address,

isOrganization,
organizationName,
organizationHeadNumber

} = req.body;


/* VALIDATIONS */

// Owner Name
if (!/^[A-Za-z ]+$/.test(ownerName)) {
return res.status(400).json({
message:"Owner name should contain letters only"
});
}


// Email
if(
!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
businessEmail
)
){
return res.status(400).json({
message:"Enter valid email"
});
}


// Mobile Number
if(
!/^(91[6-9]\d{9})$/.test(
mobile
)
){
return res.status(400).json({
message:"Mobile must start with 91 followed by 10 digits"
});

}


// Password
if(
password.length < 6 ||
password.length > 10
){
return res.status(400).json({
message:"Password must be 6-10 characters"
});
}


// Address
// Address
if(
!address ||
address.trim().length < 15
){
return res.status(400).json({
message:
"Please enter full address (Shop/House, Area, City, State)"
});
}


// Organization validation
if(isOrganization){

if(
!organizationName ||
organizationName.trim()===""
){
return res.status(400).json({
message:"Organization name required"
});
}

if(
!/^(91[6-9]\d{9})$/.test(
organizationHeadNumber
)
){
return res.status(400).json({
message:"Organization head number must start with 91 followed by 10 digits"
});
}
}




// COUNT TOTAL OWNERS
const ownerCountResult = await pool.query(
  "SELECT COUNT(*) FROM owners"
);

const totalOwners = parseInt(ownerCountResult.rows[0].count);



// DEFAULT VALUES

let subscriptionPlan = null;

let subscriptionStatus = "inactive";

let accountLocked = true;

let freeTrialUsed = false;

let trialStartDate = null;

let trialEndDate = null;


// FIRST 200 OWNERS FREE
if (totalOwners < 14) {

  subscriptionPlan = "Free Trial";

  subscriptionStatus = "active";

  accountLocked = false;

  freeTrialUsed = true;

  trialStartDate = new Date();

  trialEndDate = new Date();

  trialEndDate.setMonth(
    trialEndDate.getMonth() + 3
  );
}



// INSERT OWNER
await pool.query(
  `
  INSERT INTO owners
  (
    owner_name,
    shop_name,
    email,
    mobile,
    password,
    address,
    status,
    is_organization,
organization_name,
organization_head_number,

    subscription_plan,
subscription_status,
account_locked,
free_trial_used,
trial_start_date,
trial_end_date
  )

  VALUES
(
$1,$2,$3,$4,$5,$6,'pending',

$7,$8,$9,

$10,$11,$12,$13,$14,$15
)
  `,
  [
ownerName,
shopName,
businessEmail,
mobile,
password,
address,

isOrganization || false,
organizationName || null,
organizationHeadNumber || null,


subscriptionPlan,
subscriptionStatus,
accountLocked,
freeTrialUsed,
trialStartDate,
trialEndDate
]
);

    res.json({ message: "Owner sent to admin for approval" });

  } catch (err) {
    console.error("Register owner error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
/* -------------------------------------------
   OWNER LOGIN
--------------------------------------------*/
exports.ownerLogin = async (req, res) => {
  try {
    const { key, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM owners WHERE (unique_id=$1 OR email=$1) AND password=$2",
      [key, password]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const owner = result.rows[0];

    // 🔥 ADD THIS CHECK
    if (owner.status !== "approved") {
      return res.json({ message: "Wait for admin approval" });
    }

    const token = jwt.sign(
      { ownerID: owner.unique_id },
      process.env.JWT_SECRET,
      { expiresIn: "2d" }
    );

    await pool.query(
  `
  UPDATE owners
  SET last_active = NOW(),
      usage_status = 'active'
  WHERE owner_id = $1
  `,
  [owner.owner_id]
);

    res.json({
  message: "Login successful",
  token,

  subscription: {

subscription_plan:
owner.subscription_plan,

subscription_status:
owner.subscription_status,

account_locked:
owner.account_locked,

free_trial_used:
owner.free_trial_used,

trial_start_date:
owner.trial_start_date,

trial_end_date:
owner.trial_end_date,

subscription_start:
owner.subscription_start,

subscription_end:
owner.subscription_end

}
});

  } catch (err) {
    console.error("Owner login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* -------------------------------------------
   GET OWNER PROFILE
--------------------------------------------*/
exports.getMe = async (req, res) => {
  try {

    const ownerID = exports.getOwnerID(req);
    if (!ownerID) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const result = await pool.query(
  "SELECT * FROM owners WHERE unique_id=$1",
  [ownerID]
);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Owner not found" });
    }

    const o = result.rows[0];

    const owner = {
      owner_id: o.owner_id,
      ownerName: o.owner_name,
      uniqueID: o.unique_id,
      businessEmail: o.email,
      mobile: o.mobile,
      qrCodeDataUrl: o.qr_code_data_url,
      shopName: o.shop_name,
      address: o.address,
      doorEnabled: o.door_enabled,
      doorCharge: o.door_charge,
      gstin: o.gstin,
latitude: o.latitude,
longitude: o.longitude
    };

    res.json({ owner });

  } catch (err) {
    console.error("Get owner profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* -------------------------------------------
   UPDATE DOOR SETTINGS
--------------------------------------------*/
exports.updateDoorSettings = async (req, res) => {
  try {
    const ownerID = exports.getOwnerID(req);
    if (!ownerID) return res.status(401).json({ message: "Unauthorized" });

    const { doorEnabled, doorCharge } = req.body;

    const result = await pool.query(
  `UPDATE owners
   SET door_enabled=$1, door_charge=$2
   WHERE unique_id=$3
   RETURNING *`,
  [doorEnabled, Number(doorCharge || 0), ownerID]
);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Owner not found" });
    }

    res.json({ message: "Door settings updated", owner: result.rows[0] });

  } catch (err) {
    console.error("Update door settings error:", err);
    res.status(500).json({ message: "Server error" });
  }
};





// upadte profile by owner



exports.updateProfile = async (req, res) => {
  try {
    const ownerID = exports.getOwnerID(req);
    if (!ownerID) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { ownerName, shopName, businessEmail, address, gstin, latitude, longitude } = req.body;

    // GSTIN Validation
if (
  gstin &&
  !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(
    gstin.toUpperCase()
  )
) {
  return res.status(400).json({
    message: "Enter a valid GSTIN"
  });
}



    const result = await pool.query(
      `UPDATE owners
SET owner_name=$1, shop_name=$2, email=$3, address=$4,
    gstin=$5, latitude=$6, longitude=$7

       WHERE unique_id=$8
       RETURNING *`,
      [
  ownerName,
  shopName,
  businessEmail,
  address,
  gstin,
  latitude || null,
  longitude || null,
  ownerID
]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Owner not found" });
    }

    res.json({ message: "Profile updated successfully" });

  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};







/* -------------------------------------------
   ORGANIZATION HEAD LOGIN
--------------------------------------------*/
exports.organizationHeadLogin = async (req,res)=>{

try{

const {
organizationName,
organizationHeadNumber
}=req.body;


const result=await pool.query(
`
SELECT *
FROM owners
WHERE organization_name=$1
AND organization_head_number=$2
`,
[
organizationName,
organizationHeadNumber
]
);


if(result.rows.length===0){

return res.status(401).json({
message:"Invalid credentials"
});

}


const owner=result.rows[0];


const token=jwt.sign(

{
ownerID:owner.unique_id,
role:"organization_head"
},

process.env.JWT_SECRET,

{
expiresIn:"2d"
}

);


res.json({

message:"Organization login successful",

token,

role:"organization_head",

organizationName:
owner.organization_name,

organizationHeadNumber:
owner.organization_head_number

});

}catch(err){

console.log(err);

res.status(500).json({
message:"Server error"
});

}

};





/* -------------------------------------------
   GET ORGANIZATION STORES
--------------------------------------------*/
exports.getOrganizationStores = async (req, res) => {

try {

const { headNumber } = req.params;

if (!headNumber) {
return res.status(400).json({
message: "Head number required"
});
}

const result = await pool.query(
`
SELECT
owner_id,
owner_name,
shop_name,
mobile,
email,
organization_name,
organization_head_number,
status
FROM owners
WHERE organization_head_number = $1
ORDER BY owner_id DESC
`,
[headNumber]
);

res.status(200).json(result.rows);

} catch (err) {

console.log(err);

res.status(500).json({
message: "Server error"
});

}

};