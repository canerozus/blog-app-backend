const multer = require('multer');
const fs = require('fs');
const Post = require('../models/post');
const jwt = require('jsonwebtoken');

const post = async (req, res) => {
    const uploadMiddleware = multer({ dest: 'uploads/' }).single('file');
    let fileUrl = null;
    uploadMiddleware(req, res, async (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Failed to upload" });
        }
        const { title, summary, content } = req.body;
        if (!title || !summary || content.length <= 50) {
            return res.status(400).json({ message: "Missing required fields! (Content length must at least 50 letter.)" });
        }
        if (req.file) {
            const { originalname, path } = req.file;
            const parts = originalname.split('.');
            const ext = parts[parts.length - 1];
            const filename = path + '.' + ext;
            fs.renameSync(path, filename);
            fileUrl = filename;
        }
        try {
            const { token } = req.cookies;
            if (token) {
                jwt.verify(token, "secretKey", {}, async (err, info) => {
                    if (err) throw err;
                    const post = await Post.create({
                        title,
                        summary,
                        content,
                        cover: fileUrl,
                        author: info.id
                    });

                    res.json({ message: 'Post has been created', post });

                })
            } else {
                return res.status(200).json("no token found")
            }

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Database error" });
        }
    });
};
const getSinglePost = async (req, res) => {
    const { id } = req.params;
    const postDoc = await Post.findById(id).populate('author', ["username"])
    res.json(postDoc);

}
const deletePost = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedPost = await Post.deleteOne({ _id: id });
        res.json({ deletedPost, message: "Post Deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};
const editPost = async (req, res) => {
    const uploadMiddleware = multer({ dest: 'uploads/' }).single('file');
    let fileUrl = null;
    uploadMiddleware(req, res, async (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Failed to upload" });
        }
        const { title, summary, content } = req.body;
        const postId = req.params.id;
        if (!title || !summary || content.length <= 50) {
            return res.status(400).json({ message: "Missing required fields! (Content length must be at least 50 letters.)" });
        }
        if (req.file) {
            const { originalname, path } = req.file;
            const parts = originalname.split('.');
            const ext = parts[parts.length - 1];
            const filename = path + '.' + ext;
            fs.renameSync(path, filename);
            fileUrl = filename;
        }
        try {
            const { token } = req.cookies;
            if (token) {
                jwt.verify(token, "secretKey", {}, async (err, info) => {
                    if (err) throw err;
                    const post = await Post.findOne({ _id: postId, author: info.id });
                    if (!post) {
                        return res.status(404).json({ message: "Post not found" });
                    }
                    post.title = title;
                    post.summary = summary;
                    post.content = content;
                    if (fileUrl) {
                        post.cover = fileUrl;
                    }
                    await post.save();
                    res.json({ message: 'Post has been updated', post });
                })
            } else {
                return res.status(200).json("no token found")
            }

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Database error" });
        }
    });
};
const getPost = async (req, res) => {
    res.json(
        await Post.find()
            .populate('author', ["username"])
            .sort({ createdAt: -1 })
            .limit(20)
    );
}

module.exports = { post, getPost, getSinglePost, deletePost, editPost };  
