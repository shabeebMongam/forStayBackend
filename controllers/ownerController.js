const { Owner, validate } = require("../models/ownerModel");
const bcrypt = require("bcrypt");
const validateOwner = require("../helpers/loginValidater/loginValidate");
const jwt = require("jsonwebtoken");
const Hotel = require("../models/hotelOnlyModel");
const Room = require("../models/roomOnlyModel");
// const Owner = require("../models/ownerModel");
const { User } = require("../models/userModel");
var mongoose = require('mongoose');
const BookingDetails = require("../models/bookingDetailsModel");





const ownerLogIn = async (req, res) => {
    // const {email,password} = req.body
    try {

        const { error } = validateOwner(req.body);
        if (error)
            return res.status(400).send({ message: error.details[0].message });

        const owner = await Owner.findOne({ email: req.body.email });
        if (!owner)
            return res.status(401).send({ message: "No Account for this email" });

        const validPassword = await bcrypt.compare(
            req.body.password,
            owner.password
        );
        if (!validPassword)
            return res.status(401).send({ message: "Invalid Email or Password" });


        const token = owner.generateAuthToken();
        res.status(200).send({ ownerToken: token, message: "logged in successfully", ownerName: owner.name, ownerId: owner._id });
    }
    catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }


}

const ownerRegister = async (req, res) => {
    // const {name,email,password} = req.body
    // res.status(200).json("Reached Register")
    // console.log(name,email,password);


    try {
        const { error } = validate(req.body);
        if (error)
            return res.status(400).send({ message: error.details[0].message });

        let owner = await Owner.findOne({ email: req.body.email });
        if (owner)
            return res
                .status(409)
                .send({ message: "Owner with given email already Exist!" });

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        owner = await new Owner({ ...req.body, password: hashPassword }).save();

        res
            .status(201)
            .send({ message: "New account created" });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Internal Server Error" });
    }

}


const addHotel = async (req, res) => {

    console.log(req.body);

    const { hotelName, city, contact, pincode, district, description, imageUrls, Id: ownerId } = req.body

    console.log(ownerId);
    // const {}
    // const checkOwnerExist = await Hotel.find({ ownerId })

    const newHotel = new Hotel({
        ownerId: ownerId,

        name: hotelName,
        city: city,
        contact: contact,
        pincode: pincode,
        district: district,
        description: description,
        images: imageUrls

    })

    newHotel.save((err, data) => {
        if (err) {
            console.log(err);
        }
        // console.log(data);
        res.json("Added new hotel")
    })

}

const allHotels = async (req, res) => {
    console.log(req.body);
    const ownerId = req.body.Id
    const myHotels = await Hotel.find({
        $and: [
            { ownerId }, { status: true }
        ]
    })
    res.json(myHotels)
}

const addRoom = async (req, res) => {
    // console.log(req.body)
    console.log("hello");
    // console.log(req.params.hotelId);

    const { roomNumber, totalCapacity, description, aminities, imageUrls, roomType, price } = req.body
    const ownerId = req.body.Id
    const hotelId = req.params.hotelId


    console.log(roomNumber, totalCapacity, description, aminities[0].value, imageUrls, roomType);
    // const checkOwnerExist = await Hotel.find({ ownerId })

    const newRoom = new Room({
        ownerId: ownerId,
        hotelId: hotelId,

        roomNumber: roomNumber,
        totalCapacity: totalCapacity,
        roomType: roomType,
        aminities: aminities[0].value,
        description: description,
        images: imageUrls,
        price: price

    })

    const theNewRoomId = await newRoom.save(async (err, data) => {
        if (err) {
            console.log(err);
        }
        console.log(data._id);
        console.log(hotelId);

        const addingRoomId = await Hotel.updateOne({ _id: hotelId }, { $push: { "rooms": data._id } })
        console.log(addingRoomId);
        res.json("Added new Room")
    })

    // console.log(theNewRoomId);


}

const getEditHotel = async (req, res) => {

    const ownerId = req.body.Id
    const hotelId = req.params.hotelId

    // console.log(req.body.Id);
    // console.log(req.params);

    const theHotelToEdit = await Hotel.find({
        $and: [
            { _id: hotelId }, { ownerId: ownerId }
        ]
    })

    console.log(theHotelToEdit);



    res.json(theHotelToEdit)
}

const postEditHotel = async (req, res) => {
    console.log(req.body);
    const hotelId = req.params.hotelId

    // const {hotelName,city,contact,pincode,district,description,imageUrls} = req.body

    // const updatedHotel = await Hotel.updateOne({_id:hotelId},{ hotelName, city, contact, pincode, district, description, imageUrls})

    // console.log(updatedHotel);

    const { hotelName, city, contact, pincode, district, description, imageUrls } = req.body


    const updatedHotel = await Hotel.findOne({ _id: hotelId })

    console.log("Before");
    console.log(updatedHotel);

    updatedHotel.hotelName = hotelName
    updatedHotel.city = city
    updatedHotel.contact = contact
    updatedHotel.district = district
    updatedHotel.description = description
    imageUrls.forEach((img) => {
        updatedHotel.images.push(img)
    })

    console.log("After");
    console.log(updatedHotel);





    updatedHotel.save().then((data) => {
        console.log(data);
    }).catch((err) => {
        console.log(err);
    })

    // console.log(updatedHotel);

    res.json("Reached Here")












    // res.json("Reached")
}

const deleteHotel = async (req, res) => {
    const hotelId = req.params.hotelId
    console.log(hotelId);

    const hotelToDelete = await Hotel.findOne({ _id: hotelId })

    console.log("Before");
    console.log(hotelToDelete);

    hotelToDelete.status = false

    hotelToDelete.save().then((data) => {
        console.log(data);
    }).catch((err) => {
        console.log(err);
    })

    console.log("After");
    console.log(hotelToDelete);

    res.json({ message: "Deleted Hotel", hotelId })
}
const allRooms = async (req, res) => {
    const hotelId = req.params.hotelId
    console.log(hotelId);

    const rooms = await Room.find({ hotelId: hotelId })
    const hotel = await Hotel.find({ _id: hotelId })

    const hotelDetailes = hotel[0]

    res.json({ rooms, hotelDetailes })
}

const getOwnerData = async (req, res) => {
    console.log("reached");

    const ownerId = req.body.Id
    console.log(ownerId);
    const hotel = await Hotel.find({ ownerId })
    const hotelCount = hotel.length

    console.log(hotel);


    const ownerData = await Owner.findById({ _id: ownerId })

    res.json({ ownerData, hotelCount })
}

const deleteHotelImg = async (req, res) => {
    const { hotelId, hotelImg } = req.body

    // const hotel = await Hotel.find({$and:[{_id:hotelId},{images:hotelImg}]})
    const hotel = await Hotel.updateOne({ _id: hotelId }, { $pull: { 'images': hotelImg } })

    const hotelImgs = await Hotel.findOne({ _id: hotelId })
    // console.log("One");
    // console.log(hotelImgs.images);

    // console.log(hotelId);

    // update({ _id: ObjectId("5e8ca845ef4dcbee04fbbc11") },
    // ...    { $pull: { 'software.services': "yahoo" } }

    res.json(hotelImgs.images)
}

const bookingPendings = async (req, res) => {

    const { Id: ownerId } = req.body

    const pendingBookings = await BookingDetails.find({
        $and: [
            { ownerId }, { status: false }
        ]
    }).populate('hotelId').populate('roomId')

    console.log(pendingBookings);

    res.json(pendingBookings)
}

const approveRoom = async (req, res) => {
    // console.log(req.body);

    const { dataId, Id: ownerId } = req.body

    const approveThis = await BookingDetails.findOne({ _id: dataId })

    approveThis.status = true

    approveThis.save().then((data) => {
        console.log(data);

        res.json({message:"Room Approved"})
    }).catch((err) => {
        console.log(err);
    })

    // console.log(approveThis);



}


// const getOwnerData = async (req,res)=> {
//     console.log("heee");
//     console.log(req.body);

//     const ownerID = req.body.

// const ownerIdto = mongoose.Types.ObjectId(ownerID);

// const ownerData = await User.find({_id:ownerIdto})

// console.log(ownerData);


// }


// const addHotel = async (req,res)=>{
//     // console.log(req.body);
//     // console.log(req.headers);

//     const { hotelName, city, contact, pincode, district, description, images, ownerId, ownerName } = req.body

//     const checkOwnerExist =await Hotel.find({ownerId})
//     console.log(checkOwnerExist);


//     if(checkOwnerExist.length!=0){
//         console.log("owner Exist");
//         const newHotelToAdd = {
//             name: hotelName,
//             city: city,
//             contact: contact,
//             pincode: pincode,
//             district: district,
//             description: description,
//             images: images
//         }
//         // console.log(checkOwnerExist[0].hotels);



//         checkOwnerExist[0].hotels.push(newHotelToAdd)
//         checkOwnerExist[0].save((err, data) => {
//             if (err) {
//                 console.log(err);
//             }
//             // console.log(data);
//         })


//         res.json("Hotel added for existing owner")


//         // checkOwnerExist[0].updateOne({ ownerId:ownerId }, { $push: { hotels: newHotelToAdd } },(err,data)=>{
//         //     if(error){
//         //         console.log(err);
//         //     }
//         //     console.log(data);
//         // })
//     }else{
//         const newHotel = new Hotel({
//             ownerId: ownerId,
//             ownerName: ownerName,
//             hotels: [{
//                 name: hotelName,
//                 city: city,
//                 contact: contact,
//                 pincode: pincode,
//                 district: district,
//                 description: description,
//                 images: images
//             }]

//         })

//         newHotel.save((err, data) => {
//             if (err) {
//                 console.log(err);
//             }
//             // console.log(data);
//         })
//         res.json("owner collection created, Hotel added")
//     }
// }











module.exports = {
    ownerLogIn,
    deleteHotelImg,
    addHotel,
    ownerRegister,
    allHotels,
    addRoom,
    getOwnerData,
    getEditHotel,
    deleteHotel,
    postEditHotel,
    allRooms,
    bookingPendings,
    approveRoom
}