const multer = require('multer');
const upload = multer().single('file');

const post = (req, res) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // Multer hatası işleme
      return res.status(500).send({ message: err.message });
    } else if (err) {
      // Diğer hataların işlenmesi
      return res.status(500).send({ message: 'Bir hata oluştu.' });
    }
    // Yükleme başarılı, burada yapılacak işlemler
    res.json({ file: req.file });
  });
}

module.exports = { post };
