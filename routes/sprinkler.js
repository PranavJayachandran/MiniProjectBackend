const express = require("express")
const router = express.Router();
const mongoose = require("mongoose");
const { Sprinkler, Farm } = require("../db/model");
const { addSprinklers, MapWeatherToWeatherCondition, mapCropType, mapRegionType, mapSoilType, mapTemperature, amountToTime } = require("../helpers/sprinkler");
const { scheduler } = require("../scheduler");
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
    let { id, ifOn ,time,amt} = req.body;
    console.log(id,time,amt);
    const uri = process.env.MONGODB_CONNECTIONSTRING;
    let msg = "";
    let _id = new ObjectId(id);
    console.log(_id);
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }).then(async () => {
        let sprinkler = await Sprinkler.findOne({ _id: _id });
        sprinkler.ifOn = ifOn
        sprinkler.time=time
        sprinkler.amt=amt
        scheduler(_id+'M',time[0]);
        scheduler(_id+'E',time[1]);
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
router.post("/numberofsprinklerOn", (req, res) => {
    let { userId } = req.body;
    const uri = process.env.MONGODB_CONNECTIONSTRING;
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }).then(async () => {
        let sprinkler = await Sprinkler.find({ ifOn: true, userId: userId });
        console.log(sprinkler);
        res.send({ number: sprinkler.length });
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
router.post("/predict", async (req, res) => {
    let { temperature, weather, sprinklerID, userId } = req.body;
    let cropType, soilType, regionType;
    let _id = new ObjectId(sprinklerID);
    const uri = process.env.MONGODB_CONNECTIONSTRING;
    let connection = await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    let sprinkler = await Sprinkler.findOne({ _id: _id });
    cropType = sprinkler.cropType;
    let farm = await Farm.findOne({ userId: userId });
    soilType = farm.soilType;
    regionType = farm.regionType;

    let response = await fetch("http://127.0.0.1:5000/predict", {
        method: 'post',
        body: JSON.stringify({
            soiltype: mapSoilType(soilType),
            croptype: mapCropType(cropType),
            region: mapRegionType(regionType),
            temperature: mapTemperature(temperature),
            weather_condition: MapWeatherToWeatherCondition(weather)
        }),
    })
    try {
        let result = await response.json();
        let sprinkler = await Sprinkler.findOne({ _id: _id });
        sprinkler.waterTime=parseFloat(result);
        await sprinkler.save();
        res.send("Done"); 
    }
    catch (error) {
        console.error(error);
        res.send({ err: error })
    }
})
router.post("/water/one", async (req, res) => {
    let {   sprinklerID } = req.body;
    let _id = new ObjectId(sprinklerID);
    const uri = process.env.MONGODB_CONNECTIONSTRING;
    let connection = await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    let sprinkler = await Sprinkler.findOne({ _id: _id });
    let water=sprinkler.waterTime/2;
    if(sprinkler.amt && sprinkler.amt[0])
    water=sprinkler.amt[0];
console.log(water);
    console.log("Sending",String(amountToTime(water*2.5)));
    res.send(String(amountToTime(water*2.5)));
})
router.post("/water/two", async (req, res) => {
    let {   sprinklerID } = req.body;
    let _id = new ObjectId(sprinklerID);
    const uri = process.env.MONGODB_CONNECTIONSTRING;
    let connection = await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    let sprinkler = await Sprinkler.findOne({ _id: _id });
    let water=sprinkler.waterTime/2;
    if(sprinkler.amt && sprinkler.amt[1])
    water=sprinkler.amt[1];
    console.log("Sending",String(amountToTime(water*2.5)));
    res.send(String(amountToTime(water*2.5)));
})
router.post("/predictedWater", async (req, res) => {
    let {   sprinklerID } = req.body;
    let _id = new ObjectId(sprinklerID);
    const uri = process.env.MONGODB_CONNECTIONSTRING;
    let connection = await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    let sprinkler = await Sprinkler.findOne({ _id: _id });
    if(sprinkler.waterTime)
    res.send({water:sprinkler.waterTime});
else 
res.send({water:7})
})





module.exports = router 