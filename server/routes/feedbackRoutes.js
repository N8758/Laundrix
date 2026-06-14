const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/feedbackController');

// CUSTOMER → submit
router.post('/submit', ctrl.submitFeedback);

// OWNER → list
router.get('/owner/:ownerId', ctrl.getFeedbacksByOwner);

// OWNER → approve
router.patch('/owner/:ownerId/approve/:feedbackId', ctrl.approveFeedback);

// OWNER → delete
router.delete('/owner/:ownerId/:feedbackId', ctrl.deleteFeedback);

// CUSTOMER → get approved feedback only
router.get('/customer/:ownerId', ctrl.getApprovedFeedback);

module.exports = router;
