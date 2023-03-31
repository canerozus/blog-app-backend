const User = require('../models/user.js');

const register = async (req, res) => {
    const { username, password } = req.body;
    try {
        const userDoc = await User.create({ username, password });
        res.status(200).json(userDoc);
    }
    catch (err) {
        if (err.code === 11000 && err.keyValue && err.keyValue.username) {

            return res.status(400).json('This username already exists!');
        }
        res.status(400).json(err);
    }
    }


module.exports = { register }  