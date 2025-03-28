# VerifyMe 🔐📱
<img src="assets/Verifyme_logo.png" alt="VerifyMe Logo" width="250"/>

## Project Overview

VerifyMe is a secure two-server OTP (One-Time Password) verification system that leverages WhatsApp for sending verification codes. The application provides a seamless user authentication process using modern web technologies.

## Key Features

- Automated OTP generation
- WhatsApp-based verification
- Two-server architecture for enhanced security
- MongoDB for data storage
- Real-time OTP sending and verification

## Technology Stack

![Node.js](https://img.shields.io/badge/node-%3E%3D18.0-blue) , ![Express](https://img.shields.io/badge/Made%20with-Express.js-ff69b4) ,![MongoDB](https://img.shields.io/badge/Database-MongoDB-green),![EJS](https://img.shields.io/badge/Template-EJS-blueviolet), ![Puppeteer](https://img.shields.io/badge/Automation-Puppeteer-green)



- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Frontend**: EJS Templates
- **Automation**: Puppeteer
- **Communication**: Axios
- **WhatsApp Integration**: WhatsApp Web

## Project Structure

```
verifyme/
│
├── clientServer.js       # Client-side server handling user interactions
├── localServer.js        # Local server managing OTP generation and sending
├── models/
│   └── pair.js           # Mongoose model for storing phone-OTP pairs
├── public/
│   └── js/
│       └── code.js       # OTP generation logic
├── views/
│   ├── numberPage.ejs    # Phone number input page
│   └── codePage.ejs      # OTP verification page
└── package.json          # Project dependencies
```

## Setup and Installation

### Prerequisites

- Node.js (v14+ recommended)
- MongoDB
- WhatsApp Web account

### Installation Steps

1. Clone the repository
   ```bash
   git clone https://github.com/jayesh-verma-code/Verifyme_package.git
   cd verifyme
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start MongoDB
   ```bash
   mongod
   ```

4. Run the servers
   ```bash
   # Terminal 1
   node clientServer.js

   # Terminal 2
   node localServer.js
   ```

## How It Works

1. User enters their WhatsApp number on the client server
2. System generates a unique OTP
3. Local server sends OTP via WhatsApp using Puppeteer
4. User verifies the OTP on the client server
5. Database tracks OTP-phone number pairs

## Security Considerations

- OTPs are randomly generated
- Temporary storage of OTP-phone pairs
- WhatsApp Web used for secure messaging
- Server-side verification process

## Potential Improvements

- Implement OTP expiration
- Add rate limiting
- Enhanced error handling
- Support for multiple communication channels

## Troubleshooting

- Ensure MongoDB is running
- Check WhatsApp Web login status
- Verify all npm packages are installed
- Confirm correct phone number format

## Contributing

Contributions are welcome! Please submit pull requests or open issues on GitHub.

---

**Note**: This project is for educational purposes. Always follow WhatsApp's terms of service and local regulations when implementing messaging systems.