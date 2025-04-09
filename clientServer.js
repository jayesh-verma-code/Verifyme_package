const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Pair = require("./models/pair");
const Logistic = require("./models/logistic");
const generateOPT = require("./public/js/code");
const bodyParser = require("body-parser");
const axios = require("axios");
const cors = require("cors");

main()
.then(res => {
    console.log("connected to DB");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/verifyme');
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cors());

const port = 8080;
app.listen(port, ()=> {
    console.log("port is listining on 8080");
});

app.get("/", (req,res) => {
    res.render("numberPage.ejs");
});

app.post("/verifyOTP",async (req,res)=> {
    try{
        let {whatsappNumber} = req.body;
        let verificationCode = generateOPT();
        const response = await axios.post("http://localhost:3000/verifyme",{whatsappNumber,verificationCode});
        const newPair = response.data.newPair;
        res.render("codePage.ejs", {newPair});
    }catch(err){
        console.log("ERROR sending OTP:", err);
        res.status(500).send("Failed to send OTP.");
    }
});

app.post("/verifyOTP/:id/check",async (req,res,next) => {
    try{
        let {id} = req.params;
    let {otp} =req.body;
    console.log(otp);
    let trueCode = await Pair.findById(id);
    console.log(trueCode.verificationCode);
    if(otp == trueCode.verificationCode){
        res.send("congrate you enter righer otp");
    }else{
        res.send("wrong otp");
    }

    }catch(err) {
        console.error("Error sending OTP:", err);
        res.status(500).send("server error");
    }
});


// npm 
app.get("/verifyme/api/:MERCHANT_ID/call",async(req ,res)=> {
    let { MERCHANT_ID } = req.params;
    let logisticDetails = await Logistic.findById(MERCHANT_ID)
    // .then(res => console.log(res))
    // .catch(err => console.log(`ERROR: ${err}`));
    if (!logisticDetails) {
        return res.status(404).send("Logistic details not found");
    }
    console.log(logisticDetails);
    res.render("./client/numberPage",{logisticDetails});
});

app.post("/verifyme/logistic/:MERCHANT_ID/verifyOTP",async (req,res)=> {
    try{
        let {whatsappNumber} = req.body;
        let {MERCHANT_ID} = req.params;
        let verificationCode = generateOPT();
        const response = await axios.post("http://localhost:3000/verifyme",{whatsappNumber,verificationCode});
        const newPair = response.data.newPair;
        const logisticDetails = await Logistic.findById(MERCHANT_ID);
        res.render("./client/codePage.ejs", {newPair,logisticDetails});
    }catch(err){
        console.log("ERROR sending OTP:", err);
        res.status(500).send("Failed to send OTP.");
    }
});

app.post("/verifyme/logistic/verifyOTP/:id/:MERCHANT_ID/check",async (req,res,next) => {
    try{
        let {id, MERCHANT_ID} = req.params;
    let {otp} =req.body;
    console.log(otp);
    let logisticDetails = await Logistic.findById(MERCHANT_ID);
    let trueCode = await Pair.findById(id);
    console.log(trueCode.verificationCode);
    if(otp == trueCode.verificationCode){
        res.redirect(logisticDetails.outRoute);
    }else{
        res.render("./client/errorPage",{logisticDetails});
    }

    }catch(err) {
        console.error("Error sending OTP:", err);
        res.status(500).send("server error");
    }
});

// logistic route
app.get("/verifyme/logistic/",async(req,res)=> {
    const logisticList = await Logistic.find();
    res.render("./logistic/create",{logisticList});
});

app.post("/verifyme/logistic/create", (req,res)=> {
    let { logistic } = req.body;
    let newLogistic = new Logistic(logistic);
    newLogistic.save()
     .then(res => console.log(res))
     .catch(err => console.log(`ERROR: ${err}`));
     res.redirect("/verifyme/logistic");
});