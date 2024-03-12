const express = require("express")
const router = express.Router();
const mongoose = require("mongoose");
const { Farm } = require("../db/model");
const { addSprinklers } = require("../helpers/sprinkler");


router.post("/set", (req, res) => {
    let { userId, soilType, region, cropTypes, layout } = req.body
    console.log(userId, soilType, region, cropTypes, layout);
    const uri = process.env.MONGODB_CONNECTIONSTRING;
    let msg = "";
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }).then(async () => {
        let sprinklerLayout = await addSprinklers(layout, userId)
        let farm = await Farm.collection.insertOne({ userId: userId, soilType: soilType, regionType: region, cropTypes: cropTypes, layout: sprinklerLayout })
        res.send({ msg: "Added" });
    }).catch((error) => {
        console.error('Error saving document:', error);
        msg = "Error";
    })
        .catch((error) => {
            console.error('Error connecting to MongoDB:', error);
            res.send({ msg: "Error" })
        });

})
router.post("/layout", (req, res) => {
    let { userId } = req.body;
    const uri = process.env.MONGODB_CONNECTIONSTRING;
    let msg = "";
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }).then(async () => {
        Farm.find({ userId: userId }).then(data => {
            console.log(data[0])
            if (data[0] && data[0].layout)
                res.send({ layout: data[0].layout, cropTypes: data[0].cropTypes })
            else
                res.send({ err: "Layout was not found for this account" })
        })
    }).catch((error) => {
        console.error('Error saving document:');
        msg = "Error";
        res.send({ msg: "Error" })
    }).catch((error) => {
        console.error('Error connecting to MongoDB:');
        res.send({ msg: "Error" })
    });
})
module.exports = router 