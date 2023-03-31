const User = require('../models/user.js');
const bcrypt = require('bcryptjs');

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
}


module.exports = { register }  