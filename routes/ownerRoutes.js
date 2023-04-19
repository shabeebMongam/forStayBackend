const express = require("express");
const { ownerLogIn, ownerRegister, allRooms, dashboardData, allBookings, receivedBookingDetails, editRoomDetails, deleteRoom, approveRoom, deleteHotel, bookingPendings, allHotels, addHotel, addRoom, getOwnerData, getEditHotel, deleteHotelImg, postEditHotel } = require("../controllers/ownerController");
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
router.get('/editRoomDetails/:roomId', verifyToken, editRoomDetails )
router.get('/bookingPendings', verifyToken, bookingPendings )
router.post('/editHotel/:hotelId',verifyToken,postEditHotel )
router.post('/deleteHotel/:hotelId',verifyToken,deleteHotel )
router.post('/deleteHotelImg',verifyToken,deleteHotelImg )
router.post('/approveRoom',verifyToken,approveRoom )
router.post('/deleteRoom/:roomId', verifyToken, deleteRoom )
router.get('/receivedBookingDetails/:bookedId',verifyToken,receivedBookingDetails )
router.get('/dashboardData', verifyToken, dashboardData )
router.get('/allBookings', verifyToken, allBookings )



module.exports = router

