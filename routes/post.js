const express = require('express');
const router = express.Router();

const { post, getPost, getSinglePost } = require('../controller/post.js');


router.post('/', post);
router.get('/', getPost);
router.get('/:id', getSinglePost);

module.exports = router;