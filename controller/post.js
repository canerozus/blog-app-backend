const multer = require('multer');
const fs = require('fs');
const Post = require('../models/post');
const jwt = require('jsonwebtoken');
const AWS = require('@aws-sdk/client-s3');
const util = require('util');
const multerS3 = require('multer-s3');

const s3 = new AWS.S3({
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY,
  region: process.env.AWS_REGION,
  bucket: "eu-central-1"
});

const post = async (req, res) => {
  try {
    // Upload file to S3
    const uploadMiddleware = util.promisify(multer({
      storage: multerS3({
        s3: s3,
        bucket: "eu-central-1",
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: function (req, file, cb) {
          const { originalname } = file;
          const parts = originalname.split('.');
          const ext = parts[parts.length - 1];
          const filename = `${Date.now()}.${ext}`;
          cb(null, filename);
        }
      })
    }).single('file'));

    await uploadMiddleware(req, res);

    // Handle missing file error
    if (!req.file) {
      return res.status(400).json({ message: "File not found!" });
    }

    // Handle missing or invalid request body fields
    const { title, summary, content } = req.body;
    if (!title || !summary || content.length <= 50) {
      return res.status(400).json({ message: "Missing required fields! (Content length must be at least 50 characters.)" });
    }

    // Verify user authentication
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ message: "No token found." });
    }
    const info = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Create post in database
    const fileUrl = req.file.location;

    const post = await Post.create({
      title,
      summary,
      content,
      cover: fileUrl,
      author: info.id
    });

    // Send response
    res.json({ message: 'Post has been created', post });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
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
  const uploadMiddleware = util.promisify(multer({ dest: 'uploads/' }).single('file'));
  let fileUrl = null;
  try {
    await uploadMiddleware(req, res);
    const { title, summary, content } = req.body;
    const postId = req.params.id;
    if (!title || !summary || content.length <= 50) {
      return res.status(400).json({ message: "Missing required fields! (Content length must be at least 50 letters.)" });
    }
    if (req.file) {
      const { originalname, path } = req.file;
      const parts = originalname.split('.');
      const ext = parts[parts.length - 1];
      const filename = `${Date.now()}.${ext}`;

      const fileContent = fs.readFileSync(path);

      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: filename,
        Body: fileContent,
        ContentType: `image/${ext}`
      };

      const uploadedData = await s3.upload(params).promise();
      fileUrl = uploadedData.Location;
    }

    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ message: "No token found." });
    }

    const info = jwt.verify(token, process.env.JWT_SECRET_KEY, {});
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Database error" });
  }
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
