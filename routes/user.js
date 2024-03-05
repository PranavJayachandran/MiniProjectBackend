const express = require("express")
const router = express.Router();
const mongoose = require("mongoose");
const { User } = require("../db/model");

const getUser = (userName, passWord) => {
    let schema = new mongoose.Schema({
        userName: String,
        passWord: String
    });
    const User = mongoose.model('User', schema);
    return new User({
        userName: userName,
        passWord: passWord
    })
}

router.post("/login", (req, res) => {
    let { userName, passWord } = req.body
    console.log(userName, passWord);
    const uri = process.env.MONGODB_CONNECTIONSTRING;
    let msg = "";
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
        User.find({ userName: userName, passWord: passWord })
            .then(data => {
                if (data[0] && data[0]._id)
                    res.send({ id: data[0]._id.toString() })
                else
                    res.send({ err: "Account not found" })
            })
            .catch(error => {
                console.log(error);
            })
    }).catch((error) => {
        console.error('Error saving document:', error);
        msg = "Error";
    })
        .catch((error) => {
            console.error('Error connecting to MongoDB:', error);
            res.send({ msg: "Error" })
        });

})
router.post("/signup", (req, res) => {
    let { userName, passWord } = req.body
    console.log(userName, passWord);
    const uri = process.env.MONGODB_CONNECTIONSTRING
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            console.log('Connected to MongoDB');
            let user = getUser(userName, passWord);
            let msg = ""
            user.save()
                .then(() => {
                    msg = 'Document saved successfully';
                })
                .catch((error) => {
                    console.error('Error saving document:', error);
                    msg = "Error";
                })
                .finally(() => {
                    // Close the connection
                    mongoose.connection.close();
                    res.send({ msg: msg, id: id })
                });
        }
        )
        .catch((error) => {
            console.error('Error connecting to MongoDB:', error);
            res.send({ msg: "Error" })
        });
})

module.exports = router

