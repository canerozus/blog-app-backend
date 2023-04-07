const multer = require('multer');
const fs = require('fs');
const Post = require('../models/post');

const post = async (req, res) => {
    const uploadMiddleware = multer({ dest: './uploads' }).single('file');
    uploadMiddleware(req, res, async (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Failed to upload" });
        }
        const { title, summary, content } = req.body;
        console.log({title});
        let fileUrl;
        if (req.file) {
            const { originalname, path } = req.file;
            const parts = originalname.split('.');
            const ext = parts[parts.length - 1];
            const filename = path + '.' + ext;
            fs.renameSync(path, filename);
            fileUrl = filename;
        }
        try {
            const post = await Post.create({
                title,
                summary,
                content,
                fileUrl 
            });
            res.json({ post });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Database error" });
        }
    });
};

module.exports = { post };  
