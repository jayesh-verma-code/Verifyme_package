const mongoose = require("mongoose");

const pariSchema = mongoose.Schema({
    whatsappNumber:{
        type:Number,
        required:true
    },
    verificationCode:{
        type:Number,
        required:true
    }
});

const Pair = mongoose.model("Pair", pariSchema);
module.exports = Pair 