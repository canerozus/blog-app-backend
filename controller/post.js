const multer = require('multer');
const fs = require('fs');
const Post = require('../models/post');

const uploadMiddleware = multer({ dest: './uploads' }).single('file');

const post = async (req, res) => {
    const { title, summary, content } = req.body
    console.log(req.body)
    uploadMiddleware(req, res, (err) => {
        if (err) {
            res.status(500).send(err);
        } else {
            const { originalname, path } = req.file
            const parts = originalname.split('.');
            const ext = parts[parts.length - 1];
            const filename = path + '.' + ext;
            fs.renameSync(path, filename)
        }

    })
    // Post.create({

    // })
    res.json({title})

}

module.exports = { post };  
