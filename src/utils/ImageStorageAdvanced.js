import _ from "lodash";
import fs from "fs";
import path from "path";
import Jimp from "jimp";
import crypto from "crypto";
import mkdirp from "mkdirp";
import concat from "concat-stream";
import streamifier from "streamifier";
import config from "../config/vars.js";
import moment from "moment";

// Configure UPLOAD_PATH
const dateBasedDirectory = moment().format("YYYY/MM/DD");
const upPath = `${config.imagePath}/${dateBasedDirectory}`;
const UPLOAD_PATH = path.resolve(__dirname, "..", "..", upPath);
const baseUrl = `${config.imageBaseUrl}/${dateBasedDirectory}`;

// create a multer storage engine
const ImageStorageAdvanced = function (options) {
  // this serves as a constructor
  function ImageStorageAdvanced(opts) {
    this.responsiveDirectoryNames = ["sm", "md", "lg"];
    this.responsiveName = "responsive";
    this.responsivePaths = [];

    const allowedStorageSystems = ["local"];
    const allowedOutputFormats = ["jpg", "png"];

    // fallback for the options
    const defaultOptions = {
      storage: "local",
      output: "jpg",
      greyscale: false,
      quality: 100,
      square: false,
      threshold: 500,
      responsive: false,
    };

    // extend default options with passed options
    let options =
      opts && _.isObject(opts) ? _.pick(opts, _.keys(defaultOptions)) : {};
    options = _.extend(defaultOptions, options);

    // check the options for correct values and use fallback value where necessary
    this.options = _.forIn(options, (value, key, object) => {
      switch (key) {
        case "square":
        case "greyscale":
        case "responsive":
          object[key] = _.isBoolean(value) ? value : defaultOptions[key];
          break;

        case "storage":
          value = String(value).toLowerCase();
          object[key] = _.includes(allowedStorageSystems, value)
            ? value
            : defaultOptions[key];
          break;

        case "output":
          value = String(value).toLowerCase();
          object[key] = _.includes(allowedOutputFormats, value)
            ? value
            : defaultOptions[key];
          break;

        case "quality":
          value = _.isFinite(value) ? value : Number(value);
          object[key] =
            value && value >= 0 && value <= 100 ? value : defaultOptions[key];
          break;

        case "threshold":
          value = _.isFinite(value) ? value : Number(value);
          object[key] = value && value >= 0 ? value : defaultOptions[key];
          break;

        default:
          break;
      }
    });

    // set the upload path
    this.uploadPath = this.options.responsive
      ? path.join(UPLOAD_PATH, this.responsiveName)
      : UPLOAD_PATH;

    // set the upload base url
    this.uploadBaseUrl = this.options.responsive
      ? path.join(baseUrl, this.responsiveName)
      : baseUrl;

    if (this.options.storage === "local") {
      // if upload path does not exist, create the upload path structure
      if (this.options.responsive) {
        this.responsiveDirectoryNames.map((name) => {
          const responsivePath = path.join(this.uploadPath, name);
          if (!fs.existsSync(responsivePath)) {
            mkdirp.sync(responsivePath);
          }

          // put responsive path according to key name
          this.responsivePaths[name] = responsivePath;
        });
      } else if (!fs.existsSync(this.uploadPath)) {
        mkdirp.sync(this.uploadPath);
      }
    }
  }

  // this generates a random cryptographic filename
  ImageStorageAdvanced.prototype._generateRandomFilename = function () {
    // create pseudo random bytes
    const bytes = crypto.pseudoRandomBytes(32);

    // create the md5 hash of the random bytes
    const checksum = crypto.createHash("MD5").update(bytes).digest("hex");

    // return as filename the hash with the output extension
    return `${checksum}.${this.options.output}`;
  };

  // this creates a Writable stream for a filepath
  ImageStorageAdvanced.prototype._createOutputStream = function (filepath, cb) {
    // create a reference for this to use in local functions
    const that = this;

    // create a writable stream from the filepath
    const output = fs.createWriteStream(filepath);

    // set callback fn as handler for the error event
    output.on("error", cb);

    // set handler for the finish event
    output.on("finish", () => {
      cb(null, {
        destination: that.uploadPath,
        baseUrl: that.uploadBaseUrl,
        filename: path.basename(filepath),
        storage: that.options.storage,
      });
    });

    // return the output stream
    return output;
  };

  // this processes the Jimp image buffer
  ImageStorageAdvanced.prototype._processImage = function (image, cb) {
    // create a reference for this to use in local functions
    const that = this;

    let batch = [];

    const filename = this._generateRandomFilename();

    let mime = Jimp.MIME_PNG;

    // create a clone of the Jimp image
    let clone = image.clone();

    // fetch the Jimp image dimensions
    const width = clone.bitmap.width;
    const height = clone.bitmap.height;
    let square = Math.min(width, height);
    const threshold = this.options.threshold;

    // resolve the Jimp output mime type
    switch (this.options.output) {
      case "jpg":
        mime = Jimp.MIME_JPEG;
        break;
      case "png":
      default:
        mime = Jimp.MIME_PNG;
        break;
    }

    // auto scale the image dimensions to fit the threshold requirement
    if (threshold && square > threshold) {
      clone =
        square === width
          ? clone.resize(threshold, Jimp.AUTO)
          : clone.resize(Jimp.AUTO, threshold);
    }

    // crop the image to a square if enabled
    if (this.options.square) {
      if (threshold) {
        square = Math.min(square, threshold);
      }

      // fetch the new image dimensions and crop
      clone = clone.crop(
        (clone.bitmap.width - square) / 2,
        (clone.bitmap.height - square) / 2,
        square,
        square
      );
    }

    // convert the image to greyscale if enabled
    if (this.options.greyscale) {
      clone = clone.greyscale();
    }

    // set the image output quality
    clone = clone.quality(this.options.quality);

    if (this.options.responsive) {
      // map through  the responsive sizes and push them to the batch
      batch = _.map(this.responsiveDirectoryNames, (size) => {
        let outputStream;

        let image = null;
        let filepath = filename.split(".");

        // create the complete filepath and create a writable stream for it
        filepath = `${filepath[0]}_${size}.${filepath[1]}`;
        filepath = path.join(that.responsivePaths[size], filepath);
        outputStream = that._createOutputStream(filepath, cb);

        // scale the image based on the size
        switch (size) {
          case "sm":
            image = clone.clone().scale(0.3);
            break;
          case "md":
            image = clone.clone().scale(0.7);
            break;
          case "lg":
            image = clone.clone();
            break;

          default:
            break;
        }

        // return an object of the stream and the Jimp image
        return {
          stream: outputStream,
          image,
        };
      });
    } else {
      // push an object of the writable stream and Jimp image to the batch
      batch.push({
        stream: that._createOutputStream(
          path.join(that.uploadPath, filename),
          cb
        ),
        image: clone,
      });
    }

    // process the batch sequence
    _.each(batch, (current) => {
      // get the buffer of the Jimp image using the output mime type
      current.image.getBuffer(mime, (err, buffer) => {
        if (that.options.storage === "local") {
          // create a read stream from the buffer and pipe it to the output stream
          streamifier.createReadStream(buffer).pipe(current.stream);
        }
      });
    });
  };

  // multer requires this for handling the uploaded file
  ImageStorageAdvanced.prototype._handleFile = function (req, file, cb) {
    // create a reference for this to use in local functions
    const that = this;

    // create a writable stream using concat-stream that will
    // concatenate all the buffers written to it and pass the
    // complete buffer to a callback fn
    const fileManipulate = concat((imageData) => {
      // read the image buffer with Jimp
      // it returns a promise
      Jimp.read(imageData)
        .then((image) => {
          // process the Jimp image buffer
          that._processImage(image, cb);
        })
        .catch(cb);
    });

    // write the uploaded file buffer to the fileManipulate stream
    file.stream.pipe(fileManipulate);
  };

  // multer requires this for destroying file
  ImageStorageAdvanced.prototype._removeFile = function (req, file, cb) {
    let matches;
    let pathsplit;
    const filename = file.filename;
    const _path = path.join(this.uploadPath, filename);
    let paths = [];

    // delete the file properties
    delete file.filename;
    delete file.destination;
    delete file.baseUrl;
    delete file.storage;

    // create paths for responsive images
    if (this.options.responsive) {
      pathsplit = _path.split("/");
      matches = pathsplit.pop().match(/^(.+?)_.+?\.(.+)$/i);

      if (matches) {
        paths = _.map(
          ["lg", "md", "sm"],
          (size) => `${pathsplit.join("/")}/${matches[1]}_${size}.${matches[2]}`
        );
      }
    } else {
      paths = [_path];
    }

    // delete the files from the filesystem
    _.each(paths, (_path) => {
      fs.unlink(_path, cb);
    });
  };

  // create a new instance with the passed options and return it
  return new ImageStorageAdvanced(options);
};

// export the storage engine
export default ImageStorageAdvanced;
