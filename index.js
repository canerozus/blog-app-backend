const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const cookieParser = require("cookie-parser");
const authRoutes = require('./routes/auth.js');
const profileRoutes = require('./routes/profile.js');

app.use(cookieParser());
app.use(cors({credentials:true, origin:"http://localhost:3000"}));
app.use(express.json());
mongoose.connect("mongodb+srv://canerozus:d3Jp7zlIAobueKhB@cluster0.a7dt3ll.mongodb.net/?retryWrites=true&w=majority")

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);

app.listen(8800, () => {
    console.log("server listening on 8800");
})
//mongodb+srv://canerozus:d3Jp7zlIAobueKhB@cluster0.a7dt3ll.mongodb.net/?retryWrites=true&w=majority
//canerozus
//d3Jp7zlIAobueKhB