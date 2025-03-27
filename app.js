//uniserver code
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Pair = require("./models/pair");
const generateOPT = require("./public/js/code");
const puppeteer = require("puppeteer");
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

// Function to send OTP via Puppeteer
async function sendWhatsAppMessage(number, otp) {
    const browser = await puppeteer.launch({
        headless: false, // Debugging ke liye visible rakho
        userDataDir: "./whatsapp-session" // Session save rahega
    });

    const page = await browser.newPage();
    
    // WhatsApp Web Open Karo
    const url = `https://web.whatsapp.com/send?phone=${number}&text=*${otp}* is your *Verifyme code*. It should be kept private. Verifyme will never contact you via phone or email to share this code.`;
    await page.goto(url, { waitUntil: "networkidle2" });

    // ✅ Delay Without `waitForTimeout()`
    await new Promise(resolve => setTimeout(resolve, 5000)); // 5 sec wait

    // ✅ New Send Button Selector
    let sendButtonSelector = 'button[data-testid="compose-btn-send"]';

    try {
        await page.waitForSelector(sendButtonSelector, { timeout: 15000 });
        await page.click(sendButtonSelector);
        console.log(`✅ OTP sent to ${number}: ${otp}`);
    } catch (error) {
        console.log(`✅ OTP sent to ${number}: ${otp}`);
        await page.keyboard.press("Enter");
    }

    await new Promise(resolve => setTimeout(resolve, 5000)); // Ensure message is sent
    await browser.close();
};

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
    let newPair = new Pair({
        whatsappNumber: whatsappNumber,
        verificationCode:verificationCode
    });
    newPair.save().then(res => {console.log(res)});
    await sendWhatsAppMessage(whatsappNumber, verificationCode);
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

