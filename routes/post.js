const express = require('express');
const router = express.Router();

const { post, getPost, getSinglePost,deletePost } = require('../controller/post.js');


router.post('/', post);
router.get('/', getPost);
router.get('/:id', getSinglePost);
router.delete('/:id', deletePost);

module.exports = router;