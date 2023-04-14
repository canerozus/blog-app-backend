const jwt = require('jsonwebtoken');

const profile = async  (req,res) => {
    const {token} = req.cookies;
    if(token){
    jwt.verify(token, process.env.JWT, {}, (err, info) => {
        if(err) throw err;
        res.json(info) 
        
    })} else {
        return res.status(200).json("no token found")
    }
}

module.exports = {profile}