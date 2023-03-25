const { Admin, validate } = require("../models/adminModel");
const bcrypt = require("bcrypt");
const validateAdmin = require("../helpers/loginValidater/loginValidate");
const jwt = require("jsonwebtoken");
const Hotel = require("../models/hotelOnlyModel");
const ObjectId = require('mongodb').ObjectID;



const adminLogIn = async (req, res) => {
    // const {email,password} = req.body
    try {

        const { error } = validateAdmin(req.body);
        if (error)
            return res.status(400).send({ message: error.details[0].message });

        const admin = await Admin.findOne({ email: req.body.email });
        if (!admin)
            return res.status(401).send({ message: "No Account for this email" });

        const validPassword = await bcrypt.compare(
            req.body.password,
            admin.password
        );
        if (!validPassword)
            return res.status(401).send({ message: "Invalid Email or Password" });


        const token = admin.generateAuthToken();
        res.status(200).send({ adminToken: token, message: "logged in successfully", adminName: admin.name });
    }
    catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
}

const pendingApprovals = async (req,res)=>{
    const allHotels = await Hotel.find({adminApproval:false})
    // console.log(req.body);
    res.json(allHotels)
    // console.log(allHotels);
}

const approveHotel = async (req,res)=>{
    // console.log(req.body);
    const {hotelId} = req.body
    console.log(hotelId);


    try {
        const chekingHotel = await Hotel.findOneAndUpdate({ _id:hotelId },{adminApproval:true})
        console.log(chekingHotel);
        res.json({message:`Approved hotel ${hotelId}`,hotelId})
    } catch (error) {
        console.log(error);
    }

    // console.log(chekingHotel);

}






// const pendingApprovals =async (req,res)=>{
//     const allHotels = await Hotel.aggregate([
//         {
//             '$unwind': {
//                 'path': '$hotels'
//             }
//         }, {
//             '$match': {
//                 'hotels.status': false
//             }
//         }
//     ])
//     // console.log(allHotels);
//     res.json(allHotels)
// }

// const approveHotel = async (req,res)=>{
//     const {ownerId,hotelId} = req.body
//     console.log(req.body);

//     // const chekingUserAndHotel = await Hotel.find({ownerId})
//     // console.log(chekingUserAndHotel);
//     try{
//     const chekingUserAndHotel = await Hotel.findOneAndUpdate({$and:[{ownerId},{"hotels._id":hotelId}]},{$set:{"hotels.$.status":true}})
//         // console.log(chekingUserAndHotel);
//         res.json({messsage:`Approved hotel ${hotelId}`,hotelId})

//     }catch(err){
//         console.log(err.message);
//     }
   
// }


module.exports = {
    adminLogIn,
    pendingApprovals,
    approveHotel
}