const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Pair = require("./models/pair");
const generateOPT = require("./public/js/code");
const bodyParser = require("body-parser");
const axios = require("axios");

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


