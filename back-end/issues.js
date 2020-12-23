const mongoose = require('mongoose');
const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const fs = require('fs');
const router = express.Router();
const users = require('./users.js');

const upload = multer({
    dest: '/var/www/issues.jacob-williams.me/images',
    limits: {
        fileSize: 10000000
    }
});

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
    from: '"NovaMachina Mods Issues " ' + emailConfig.sender,
    to: emailConfig.recipiant,
    // subject: 'Test Email',
    // text: 'Hello World!',
    // html: '<b>Hello World!</b><br>This is the first email sent with Nodemailer in Node.js'
};

const User = users.model;
const validUser = users.valid;

const issueSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    urlSlug: String,
    username: String,
    title: String,
    forgeVersion: String,
    selectedMod: String,
    description: String,
    images: Array,
    files: Array,
    created: Number,
    responses: Array,
    resolved: {
        type: Boolean,
        default: false
    }
});

const Issue = mongoose.model("Issue", issueSchema);

router.get('/', async (req, res) => {
    let issues = [];
    try {
        let pageSize = 10;
        let page = req.query.page;
        let mod = req.query.mod;
        let pageCount = 0;
        if (mod === 'all') {
            issues = await Issue.find().skip((page * pageSize) - pageSize).limit(pageSize).sort({
                created: -1
            });
            pageCount = Math.floor((await Issue.countDocuments() / pageSize)) + 1;
        } else {
            issues = await Issue.find({
                selectedMod: mod
            }).skip((page * pageSize) - pageSize).limit(pageSize).sort({
                created: -1
            });
            pageCount = Math.floor((await Issue.countDocuments({
                selectedMod: mod
            }) / pageSize)) + 1;
        }
        return res.send({
            issues: issues,
            issuePages: pageCount
        });
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

router.get('/:slug', async (req, res) => {
    try {
        let issue = await Issue.findOne({
            urlSlug: req.params.slug
        });
        if (!issue) {
            return res.sendStatus(404);
        }
        return res.send({
            issue: issue
        });
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

router.post('/', validUser, async (req, res) => {
    const issue = new Issue({
        user: req.user,
        username: req.user.username,
        title: req.body.title,
        forgeVersion: req.body.forgeVersion,
        selectedMod: req.body.selectedMod,
        description: req.body.description,
        images: req.body.images,
        files: req.body.files,
        created: new Date().getTime(),
        urlSlug: await getUrlSlug(req.body.title)
    });
    try {
        await issue.save();
        sendEmail(issue);
        return res.send({
            issue: this.issue
        });
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

router.post('/images', upload.single('photo'), async (req, res) => {
    if (!req.file) {
        return res.sendStatus(400);
    }
    res.send({
        path: "/images/" + req.file.filename
    });
});

router.put('/resolve/:id', validUser, async (req, res) => {
    try {
        let issue = await Issue.findOne({
            _id: req.params.id
        });
        issue.resolved = true;
        issue.save();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.put('/unresolve/:id', validUser, async (req, res) => {
    try {
        let issue = await Issue.findOne({
            _id: req.params.id
        });
        issue.resolved = false;
        issue.save();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.put('/addResponse/:id', validUser, async (req, res) => {
    try {
        let issue = await Issue.findOne({
            _id: req.params.id
        });
        let response = req.body;
        response.created = new Date().getTime();
        issue.responses.push(response);
        issue.save();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

async function getUrlSlug(title) {
    let slug = title.toLowerCase();
    slug = slug.replace(/ /g, "-");
    let foundExisting = false;
    let collisionResolution = 0;
    let proposedSlug = slug;
    do {
        foundExisting = false;
        let existing = await Issue.findOne({
            urlSlug: proposedSlug
        });
        if (existing) {
            foundExisting = true;
            proposedSlug = slug + "-" + collisionResolution;
            collisionResolution++;
        }
    } while (foundExisting)

    return proposedSlug;
}

async function sendEmail(issue) {
    mailOptions.subject = "New Issue: " + issue.title
    mailOptions.text = issue.description;
    mailOptions.html = "<h3>" + issue.title + "</h3><br><p>" + issue.description + "</p><br><p>Submitted on: " + issue.created + "</p>";

    transporter.sendMail(mailOptions, function (error, info) {
        if(error) {
            return console.log(error);
        }
    });
}

module.exports = {
    routes: router
}