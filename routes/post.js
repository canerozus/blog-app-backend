const express = require('express');
const router = express.Router();

const { post } = require('../controller/post.js');



router.post('/', post);

module.exports = router;