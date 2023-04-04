const express = require('express');
const {register, login, logout} = require('../controller/auth.js');

const router = express.Router();

router.post('/register', register);
router.post('/logout', logout);
router.post('/login', login);

module.exports = router;