const mongoose = require("mongoose")
let schema = new mongoose.Schema({
    userName: String,
    passWord: String
});
const User = mongoose.model('User', schema);

schema = new mongoose.Schema({
    userId: String,
    cropTypes: [String],
    regionType: String,
    soilType: String,
    layout: [[String]]
});
const Farm = mongoose.model('Farm', schema);



schema = new mongoose.Schema({
    userId: String,
    sprinklerLayout: [[Number]]
});
const Layout = mongoose.model('Layout', schema);


schema = new mongoose.Schema({
    sprinklerName: String,
    cropType: String,
    ifOn: Boolean,
    userId: String,
    waterTime:Number
});
const Sprinkler = mongoose.model('Sprinkler', schema);

module.exports = { User, Farm, Layout, Sprinkler }