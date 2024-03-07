const express = require("express")
const router = express.Router();
const mongoose = require("mongoose");
const { Sprinkler } = require("../db/model");
const { addSprinklers } = require("../helpers/sprinkler");
const { ObjectId } = mongoose.Types;

//Here a post request for a get, becuase the url will become huge passing id as url parameter in get
router.post("/", (req, res) => {
    let { id } = req.body;
    const uri = process.env.MONGODB_CONNECTIONSTRING;
    let msg = "";
    let _id = new ObjectId(id);
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }).then(async () => {
        Sprinkler.findById(_id).then(data => {
            res.send({ data: data })
        })
    }).catch((error) => {
        console.error('Error saving document:', error);
        msg = "Error";
        res.send({ msg: "Error" })
    })
        .catch((error) => {
            console.error('Error connecting to MongoDB:', error);
            res.send({ msg: "Error" })
        });

})

router.post("/changeData", (req, res) => {
    let { id, cropType, sprinklerName } = req.body;
    const uri = process.env.MONGODB_CONNECTIONSTRING;
    let msg = "";
    let _id = new ObjectId(id);
    console.log(_id);
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }).then(async () => {
        let sprinkler = await Sprinkler.findOne({ _id: _id });
        console.log(sprinkler);
        sprinkler.cropType = cropType;
        sprinkler.sprinklerName = sprinklerName;
        await sprinkler.save();
        res.send("Done");
    }).catch((error) => {
        console.error('Error saving document:', error);
        msg = "Error";
        res.send({ msg: "Error" })
    })
        .catch((error) => {
            console.error('Error connecting to MongoDB:', error);
            res.send({ msg: "Error" })
        });

})

router.post("/changeState", (req, res) => {
    let { id, ifOn } = req.body;
    const uri = process.env.MONGODB_CONNECTIONSTRING;
    let msg = "";
    let _id = new ObjectId(id);
    console.log(_id);
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }).then(async () => {
        let sprinkler = await Sprinkler.findOne({ _id: _id });
        sprinkler.ifOn = ifOn
        await sprinkler.save();
        res.send("Done");
    }).catch((error) => {
        console.error('Error saving document:', error);
        msg = "Error";
        res.send({ msg: "Error" })
    })
        .catch((error) => {
            console.error('Error connecting to MongoDB:', error);
            res.send({ msg: "Error" })
        });

})
module.exports = router 