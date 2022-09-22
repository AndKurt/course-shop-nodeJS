const multer = require('multer')

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, 'images')
  },
  filename(req, file, callback) {
    callback(null, Date.now() + '-' + file.originalname)
  },
})

const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg']

const fileFilter = (req, file, callback) => {
  if (allowedTypes.includes(file.mimetype)) {
    callback(null, true)
  } else {
    callback(null, true)
  }
}

module.exports = multer({ storage, fileFilter })
