/* eslint no-unused-expressions: 0 */
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const mime = require('mime');
const mkdirp = require('mkdirp');
const config = require('../../config/vars');

// Configure UPLOAD_PATH
const UPLOAD_PATH = path.resolve(__dirname, '..', '..', config.imagePath);


const limits = {
  files: 1, // allow only 1 file per request
  fileSize: 3 * 1024 * 1024, // 3 MB (max file size)
};

const fileFilter = (req, file, cb) => {
  // supported image file mimetypes
  const allowedMimes = ['image/jpeg', 'image/pjpeg', 'image/png', 'image/gif'];

  if (_.includes(allowedMimes, file.mimetype)) {
    // allow supported image files
    cb(null, true);
  } else {
    // throw error for invalid files
    cb(new Error('Invalid file type. Only jpg, png and gif image files are allowed.'));
  }
};

const storage = multer.diskStorage({
  destination(req, file, cb) {
    !fs.existsSync(UPLOAD_PATH) && mkdirp.sync(UPLOAD_PATH);
    cb(null, UPLOAD_PATH);
  },
  filename(req, file, cb) {
    crypto.pseudoRandomBytes(16, (err, raw) => {
      cb(null, `${raw.toString('hex') + Date.now()}.${mime.getExtension(file.mimetype)}`);
    });
  },
});

module.exports = multer({
  storage,
  limits,
  fileFilter,
});
