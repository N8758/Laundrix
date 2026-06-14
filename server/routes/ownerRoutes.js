
// server/routes/ownerRoutes.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");



const {
  registerOwner,
  ownerLogin,
  organizationHeadLogin,
  getOrganizationStores,
  getMe,
  updateDoorSettings,
  updateProfile
} = require("../controllers/ownerController");

/* -------------------------------------------
   JWT MIDDLEWARE (VERIFY OWNER)
--------------------------------------------*/
const verifyOwner = (req, res, next) => {
  const header = req.headers.authorization || "";

  // Check token format
  if (!header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const token = header.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // attach ownerID to request
    req.ownerID = decoded.ownerID;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

/* -------------------------------------------
   PUBLIC ROUTES
--------------------------------------------*/
router.post("/register", registerOwner);
router.post("/login", ownerLogin);

router.post(
"/organization-login",
organizationHeadLogin
);



router.get(
"/organization-stores/:headNumber",
getOrganizationStores
);

/* -------------------------------------------
   PROTECTED ROUTES (REQUIRE TOKEN)
--------------------------------------------*/
router.get("/me", verifyOwner, getMe);
router.put("/door-settings", verifyOwner, updateDoorSettings);
router.patch("/update-profile", verifyOwner, updateProfile);






module.exports = router;

