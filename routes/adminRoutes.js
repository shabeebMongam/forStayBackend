const express = require("express");
const { adminLogIn, pendingApprovals, approveHotel } = require("../controllers/adminController");
const { verifyToken } = require("../helpers/tokenVerification/verifyToken");
const router = express.Router();


router.post('/login', adminLogIn)
router.get('/approval',verifyToken, pendingApprovals)
router.post('/approveHotel', approveHotel )



module.exports = router

