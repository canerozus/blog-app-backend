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
app.use(cors({ credentials: true, origin: [ "https://blog-app-backend-rose.vercel.app", "http://localhost:3000"] }));
app.use(express.json());
mongoose.connect(process.env.MONGODB_URL)

app.use("/api/profile", profileRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);

app.get("/", (req, res) => {
    res.json("server start")
})
app.listen(process.env.PORT || 8800, () => {
    console.log("server listening on 8800");
})
