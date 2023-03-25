const express = require("express");
const { ownerLogIn, ownerRegister, allRooms, approveRoom, deleteHotel, bookingPendings, allHotels, addHotel, addRoom, getOwnerData, getEditHotel, deleteHotelImg, postEditHotel } = require("../controllers/ownerController");
const { verifyToken } = require("../helpers/tokenVerification/verifyToken");
const router = express.Router();


// router.get('/', userLogIn)
router.post('/login', ownerLogIn)
router.post('/register', ownerRegister)
router.post('/addHotel', verifyToken, addHotel)
router.get('/getOwnerData', verifyToken, getOwnerData)
router.get('/getMyHotels',verifyToken, allHotels)
router.get('/getRoomData/:hotelId',verifyToken, allRooms)
router.post('/addRoom/:hotelId',verifyToken, addRoom)
router.get('/editHotel/:hotelId',verifyToken,getEditHotel )
router.get('/bookingPendings', verifyToken, bookingPendings )
router.post('/editHotel/:hotelId',verifyToken,postEditHotel )
router.post('/deleteHotel/:hotelId',verifyToken,deleteHotel )
router.post('/deleteHotelImg',verifyToken,deleteHotelImg )
router.post('/approveRoom',verifyToken,approveRoom )



module.exports = router

