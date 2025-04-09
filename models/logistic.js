const mongoose = require('mongoose');

const logisticSchema = mongoose.Schema({
    inRoute:{
        type:String,
        required:true
    },
    outRoute:{
        type:String,
        required:true
    },
    companyName:{
        type:String,
        required:true
    },
    companyLogoLink:{
        type:String,
        required:true
    }
});

const Logistic = mongoose.model("Logistic", logisticSchema);
module.exports = Logistic;