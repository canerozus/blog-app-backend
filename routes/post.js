const express = require('express');
const router = express.Router();

const { post, getPost } = require('../controller/post.js');



router.post('/', post);
router.get('/', getPost);

module.exports = router;