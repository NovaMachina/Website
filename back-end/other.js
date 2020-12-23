const express = require('express');
const nodemailer = require('nodemailer');
const fs = require('fs');
const router = express.Router();

var emailConfig = JSON.parse(fs.readFileSync('emailConfig.json', 'utf8'));

let transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    secureConnection: false,
    port: 587,
    tls: {
        ciphers: 'SSLv3'
    },
    auth: {
        user: emailConfig.username,
        pass: emailConfig.password
    }
});

var mailOptions = {
    to: emailConfig.recipiant
}

router.post('/contact', async (req, res) => {
    mailOptions.from = req.body.fromEmail;
    mailOptions.subject = "Personal Website Contact";
    mailOptions.text = req.body.content;
    mailOptions.html = "<p>" + req.body.content + "</p>";

    try {
        transporter.sendMail(mailOptions, function (error, info) {
            if(error) {
                throw error;
            }
        });
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

module.exports = {
    routes: router
}