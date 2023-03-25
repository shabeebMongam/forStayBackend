const express = require("express");
const { userLogIn, userRegister, verifyUserEmail, getUserData, getBookings, getHotels, getHotelData, informOwnerBooking, getRoomData } = require("../controllers/userController");
const { verifyToken } = require("../helpers/tokenVerification/verifyToken");
const router = express.Router();


// router.get('/', userLogIn)
router.post('/login', userLogIn)
router.post('/register', userRegister)
router.get('/users/:id/verify/:token', verifyUserEmail)
router.get('/getHotels', getHotels)
router.get('/myBookings', verifyToken, getBookings)
router.get('/getHotelData/:hotelId', getHotelData)
router.get('/getRoomData/:hotelId/:roomId', getRoomData)
router.get('/userData', verifyToken, getUserData)
router.post('/informOwnerBooking',verifyToken, informOwnerBooking)



module.exports = router

