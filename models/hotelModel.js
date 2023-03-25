const mongoose = require('mongoose')

const hotelSchema = new mongoose.Schema({
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "Owner" },
    ownerName:  String ,
    hotels: [{
        type: new mongoose.Schema({
            name: { type: String, required: true },
            city: { type: String, required: true },
            contact: { type: Number, required: true },
            pincode: { type: Number, required: true },
            district: { type: String, required: true },
            description: { type: String, required: true },
            images: { type: Array, required: true },
            status: { type: Boolean, default: true },
            adminApproval: { type: Boolean, default: false },
            rooms: { type: mongoose.Schema.Types.ObjectId, ref: "Room" }
        }, { timestamps: true })
    }]
},
    {
        timestamps: true
    });

const Hotel = mongoose.model("hotel", hotelSchema);

module.exports = Hotel; 