const { User, validate } = require("../models/userModel");
const bcrypt = require("bcrypt");
const validateUser = require("../helpers/loginValidater/loginValidate");
const jwt = require("jsonwebtoken");
const sendEmail = require('../helpers/verificationMail/nodeMailer')
const Token = require("../models/tokenToVerifyMail")
const crypto = require("crypto");
const Hotel = require("../models/hotelOnlyModel");
const Room = require("../models/roomOnlyModel");
const BookingDetails = require("../models/bookingDetailsModel");




const userLogIn = async (req, res) => {
    // const {email,password} = req.body
    try {

        const { error } = validateUser(req.body);
        if (error)
            return res.status(400).send({ message: error.details[0].message });

        const user = await User.findOne({ email: req.body.email });
        if (!user)
            return res.status(401).send({ message: "No Account for this email" });

        const validPassword = await bcrypt.compare(
            req.body.password,
            user.password
        );
        if (!validPassword)
            return res.status(401).send({ message: "Invalid Email or Password" });

        if (!user.verified) {
            let token = await Token.findOne({ userId: user._id });
            if (!token) {
                token = await new Token({
                    userId: user._id,
                    token: crypto.randomBytes(32).toString("hex"),
                }).save();
                const url = `${process.env.BASE_URL}users/${user.id}/verify/${token.token}`;
                await sendEmail(user.email, "Verify Email", url);
            }

            return res
                .status(400)
                .send({ message: "An Email sent to your account please verify" });
        }

        const token = user.generateAuthToken();
        res.status(200).send({ userToken: token, message: "logged in successfully", userName: user.name });
    }
    catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }


}

const userRegister = async (req, res) => {


    try {
        const { error } = validate(req.body);
        if (error) {
            return res.status(400).send({ message: error.details[0].message });
        }
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(409).send({ message: "User with given email already Exist!" });
        }
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(req.body.password, salt);



        user = await new User({ ...req.body, password: hashPassword }).save();

        const token = await new Token({
            userId: user._id,
            token: crypto.randomBytes(32).toString("hex"),
        }).save();
        console.log(process.env.BASE_URL);
        const url = `${process.env.BASE_URL}users/${user.id}/verify/${token.token}`;

        await sendEmail(user.email, "Verify Email", url);

        res.status(201).send({ message: "An Email sent to your account please verify" });

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Internal Server Error" });
    }

}

const verifyUserEmail = async (req, res) => {
    console.log("reached");
    try {
        const user = await User.findOne({ _id: req.params.id });
        if (!user) return res.status(400).send({ message: "Invalid link" });

        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token,
        });
        console.log("dasdas");
        if (!token) return res.status(400).send({ message: "Invalid link" });

        console.log("dsadasd");
        const newVerified = await User.updateOne({ _id: user._id }, { $set: { verified: true } })
        console.log(newVerified);
        await token.remove();

        res.status(200).send({ message: "Email verified successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
}

const getHotels = async (req,res)=>{
    try {
        const allHotels = await Hotel.find({
             $and: [
            { adminApproval: true }, { status: true }
        ]
        })
        res.json(allHotels)
    } catch (error) {
        console.log(error);
    }
}

const getHotelData = async (req,res)=>{
    try{
        const hotelId = req.params.hotelId;
        console.log(hotelId);

        const hotel = await Hotel.findOne({_id:hotelId}).populate({path:"rooms"})

        console.log(hotel);

        // hotel.populate("rooms").then((roomsData)=> console.log(roomsData)).catch(err=>console.log(err))


        res.json(hotel)
    }catch(error){
        console.log(error);
    }
}

const getRoomData = async (req,res)=>{
    try {
        const hotelId = req.params.hotelId;
        const roomId = req.params.roomId;

        console.log(req.params);


        const hotel=await Hotel.findOne({_id:hotelId})
        const room=await Room.findOne({_id:roomId})

        res.json({hotel,room})


    } catch (error) {
        console.log(error);
    }

}


const informOwnerBooking = (req,res)=>{
    // console.log(req.body);
    const{values,roomId,hotelId,Id : userId,startDate,endDate} = req.body
    // console.log(values);

    const bookingData = new BookingDetails({
        hotelId,
        roomId,
        startDate,
        endDate,
        userId,

        name:values.name,
        email:values.email,
        address:values.address,
        city:values.city,
        state:values.state,
        zipcode:values.zipcode
    })

    bookingData.save().then((data)=>{
        console.log(data);
        res.json({message:"Queued your Booking"})
    })

}

const getBookings = async (req,res)=>{
    console.log("yeas");
    console.log(req.body);
    const {Id:userId} = req.body;

    const bookingData = await BookingDetails.find({ userId })
    // console.log(bookingData);
    res.json(bookingData)
}

const getUserData = async (req,res)=>{
  console.log(req.body);
  const {Id: userId} = req.body

  const userData = await  User.findOne({_id:userId}) 
  console.log(userData);

  res.json(userData)
}





// const getRoomData = await (req,res)=>{
//     try {
//         const hotelId = req.params.hotelId;
//         const roomId = req.params.roomId;


//         const hotel=await Hotel.findOne({_id:hotelId})
//         const room=await Room.findOne({_id:hotelId})



//         res.json("yes")



//     } catch (error) {
        
//     }
// }
















module.exports = {
    userLogIn,
    userRegister,
    verifyUserEmail,
    getHotels,
    getHotelData, 
    getBookings,
    getRoomData,
    informOwnerBooking,
    getUserData
}