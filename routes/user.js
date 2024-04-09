const express = require("express")
const router = express.Router();
const mongoose = require("mongoose");
const { User } = require("../db/model");

const getUser = (userName, passWord) => {
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
                res.send({ err: "Unknown Error" })
            })
    }).catch((error) => {
        console.error('Error saving document:', error);
        msg = "Error";
    })
        .catch((error) => {
            console.error('Error connecting to MongoDB:', error);
            res.send({ err: "Error connecting to the Db" })
        });

})
router.post("/signup", (req, res) => {
    let { userName, passWord } = req.body
    console.log(userName, passWord);
    const uri = process.env.MONGODB_CONNECTIONSTRING
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(async () => {
            let user = await User.find({ userName: userName })
            if (user.length > 0) {
                res.send({ err: "Account with the same username already exists" });
            }
            else {
                let user = getUser(userName, passWord);
                let msg = ""
                user.save()
                    .then((temp) => {
                        msg = 'Document saved successfully';
                        res.send({ id: temp.id })
                    })
                    .catch((error) => {
                        console.error('Error saving document:', error);
                        msg = "Error saving the data";
                        res.send({ err: msg })

                    })
            }
        }
        )
        .catch((error) => {
            console.error('Error connecting to MongoDB:', error);
            res.send({ err: "Error connecting to the Db" })
        });
})

module.exports = router

