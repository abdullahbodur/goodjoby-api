const multer = require("multer");
const path = require("path");
const CustomError = require("../error/CustomError");
const crypting = require("./crypting");

const createNewFileSystem = (
  uploadPath,
  filename,
  allowedTypes,
  isDocument,
  fileSize
) => {
  const storage = multer.diskStorage({
    destination: function (req, file, callback) {
      const rootDir = path.dirname(require.main.filename);
      callback(null, path.join(rootDir, `/public/uploads/${uploadPath}`));
    },
    filename: function (req, file, callback) {

      const extension = file.mimetype.split("/")[1];
      const id = crypting(isDocument ? req.params.id : req.user.client_id);

      if (isDocument)
        req.files[req.files.length - 1]["file_url"] = `${filename}${id}_${
          req.files.length - 1
        }.${extension}`;

      isDocument
        ? (req.savedFileName = req.files[req.files.length - 1]["file_url"])
        : (req.savedFileName = `${filename}${id}.${extension}`);

      callback(null, req.savedFileName);
    },
  });

  const fileFilter = (req, file, callback) => {
    const allowedMimeTypes = allowedTypes;
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return callback(
        new CustomError("Please provide a file with different extension", 400),
        false
      );
    }

    return callback(null, true);
  };

  return multer({
    storage,
    fileFilter,
    limits: {
      fileSize,
    },
  });
};

module.exports = createNewFileSystem;
