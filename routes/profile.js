const express = require('express');
const { profile } = require('../controller/profile.js');

const router = express.Router();

router.get('/', profile);

module.exports = router;