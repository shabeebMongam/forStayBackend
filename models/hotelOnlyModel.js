const mongoose = require('mongoose')

const hotelOnlySchema = new mongoose.Schema({
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "Owner" },

    name: { type: String, required: true },
    city: { type: String, required: true },
    contact: { type: Number, required: true },
    pincode: { type: Number, required: true },
    district: { type: String, required: true },
    description: { type: String, required: true },
    images: { type: Array, required: true },
    status: { type: Boolean, default: true },
    adminApproval: { type: Boolean, default: false },
    rooms: [{ type: mongoose.Schema.Types.ObjectId, ref: "room" }]

},
    {
        timestamps: true
    });

const Hotel = mongoose.model("hotel", hotelOnlySchema);

module.exports = Hotel; 