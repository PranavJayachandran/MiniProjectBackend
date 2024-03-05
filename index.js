const express = require('express');
const cors = require("cors");
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const userRoutes = require("./routes/user");
const farmRoutes = require("./routes/farm");
const mongoose = require('mongoose');
app.use(cors());
app.use(express.json());

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

app.use("/user", userRoutes)
app.use("/farm", farmRoutes)

app.get('/', (req, res) => {
    res.send('Hello, World!');
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
