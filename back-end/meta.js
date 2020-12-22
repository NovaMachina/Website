const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const axios = require('axios');

const metaSchema = mongoose.Schema({
    revision: {
        type: String,
        default: "1.0"
    },
    forgeVersions: {
        type: Array,
        default: []
    },
    mods: {
        type: Array,
        default: []
    },
    lastUpdated: {
        type: Number,
        default: new Date().getTime()
    }
});

const Meta = mongoose.model("Meta", metaSchema);

router.get('/', async (req, res) => {
    try {
        let meta = await Meta.findOne({
            revision: "1.0"
        });
        if (meta == null) {
            meta = await generateMeta();
            res.send({
                forgeVersions: meta.forgeVersions,
                modOptions: meta.mods
            });
            return;
        }
        updateForgeVersions(meta);
        res.send({
            forgeVersions: meta.forgeVersions,
            modOptions: meta.mods
        })
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.delete('/mod', async (req, res) => {
    try {
        let meta = await Meta.findOne({
            revision: "1.0"
        });
        meta.mods.splice(meta.mods.indexOf(req.body.modToDelete), 1);
        meta.save();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});
router.put('/mod', async (req, res) => {
    try {
        let meta = await Meta.findOne({
            revision: "1.0"
        });
        meta.mods.push(req.body.mod);
        meta.save();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

async function updateForgeVersions(meta) {
    let timestampDifference = new Date().getTime() - meta.lastUpdated;
    let maxTimeDifference = 60 * 60 * 1000;
    if (timestampDifference >= maxTimeDifference) {
        meta.forgeVersions = await getNewVersions();
        meta.lastUpdated = new Date().getTime();
        await meta.save();
    }
}

async function generateMeta() {
    let meta = new Meta();
    meta.forgeVersions = await getNewVersions();
    meta.save();
    return meta;
}

async function getNewVersions() {
    return await axios.get("https://addons-ecs.forgesvc.net/api/v2/minecraft/modloader")
        .then(response => {
            return response.data;
        })
        .then(json => {
            let versions = [];
            json.forEach(item => {
                if (item.gameVersion.includes("1.16")) {
                    versions.push(item.name);
                }
            });
            return versions;
        });
}

module.exports = {
    routes: router
}