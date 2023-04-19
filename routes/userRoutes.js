const express = require("express");
const { userLogIn, userRegister, toVerify, placeSearch, hotelDistWithCount, getAddress, hotelByDistrict, addReservedDate, forOrders, verifyUserEmail, getUserData, getBookings, getHotels, getHotelData, informOwnerBooking, getRoomData } = require("../controllers/userController");
const { verifyToken} = require("../helpers/tokenVerification/verifyToken");
const { verifyTokenForUser } = require("../helpers/tokenVerification/verifyTokenForUser");
const router = express.Router();


// router.get('/', userLogIn)
router.post('/login', userLogIn)
router.post('/register', userRegister)
router.get('/users/:id/verify/:token', verifyUserEmail)
router.post('/getHotels',  getHotels)
router.get('/myBookings', verifyTokenForUser, getBookings)
router.get('/getHotelData/:hotelId', getHotelData)
router.get('/getRoomData/:hotelId/:roomId', getRoomData)
router.get('/userData', verifyToken, getUserData)
router.post('/informOwnerBooking',verifyToken, informOwnerBooking)
router.post('/serachPlace', verifyToken, placeSearch)
router.get('/hotelByDistrict/:district', verifyToken, hotelByDistrict)
router.get('/address', verifyToken, getAddress)
router.get('/hotelDistWithCount', verifyToken, hotelDistWithCount)

router.post("/orders",verifyToken,forOrders)
router.post("/verify", verifyToken,toVerify)
router.post("/addReservedDate", verifyToken, addReservedDate)



module.exports = router

