const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const dotenv = require("dotenv")
const cookieParser = require("cookie-parser");
const authRoutes = require('./routes/auth.js');
const profileRoutes = require('./routes/profile.js');
const postRoutes = require('./routes/post.js');
dotenv.config()
app.use('/uploads', express.static(__dirname + '/uploads'))
app.use(cookieParser());
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
mongoose.connect('mongodb+srv://canerozus:d3Jp7zlIAobueKhB@cluster0.a7dt3ll.mongodb.net/?retryWrites=true&w=majority')

app.use("/api/profile", profileRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);

app.get("/", (req, res) => {
    res.json("server start")
})
app.listen(process.env.PORT || 8800, () => {
    console.log("server listening on 8800");
})
