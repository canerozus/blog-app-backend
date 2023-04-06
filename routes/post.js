const express = require('express');
const { post} = require('../controller/post.js');
const router = express.Router();
const multer = require('multer');

const uploadMiddleware = multer({dest: "uploads/"})

router.post('/', uploadMiddleware.single('file'), post);

module.exports = router;