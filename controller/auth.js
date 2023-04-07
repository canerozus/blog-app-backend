const User = require('../models/user.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    const salt = bcrypt.genSaltSync(10);
    const { username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, salt);
    try {
        await User.create({ username, password: hashedPassword });
        return res.status(200).json("User has been created!");
    }
    catch (err) {
        if (err.code === 11000 && err.keyValue && err.keyValue.username) {
            return res.status(400).json('This username already exists!');
        }
        res.status(400).json(err);
    }
};

const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if(!user) return res.status(401).json("No username found!");
        const passCheck = bcrypt.compareSync(password, user.password);
        if(passCheck){
            jwt.sign({username,id:user._id},"secretKey", (err, token)=>{
            res.cookie("token", token).json({
                message:"logging in",
                id:user._id,
                username
            })
            })
        } else {
            return res.status(403).json('Invalid username or password!');
        }
    }
    catch (err) {
        console.log(err)
    }
}
const logout = (req, res) => {
    res.clearCookie("token", {
        secure: true,
        sameSite: "none"
    }).status(200).json("User logged out.")
}

module.exports = { register, login, logout };  