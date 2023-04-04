const jwt = require('jsonwebtoken');

const profile = async  (req,res) => {
    const {token} = req.cookies;
    jwt.verify(token,"secretKey", (err, info) => {
        if(err) throw err;
        res.json(info)
    })
}

module.exports = {profile}