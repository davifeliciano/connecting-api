import multer from "multer";
import FileTypeNotAllowedError from "../errors/FileTypeNotAllowedError.js";
import httpStatus from "http-status";

// TODO: import file limit and allowed extensions from config
const storage = multer.memoryStorage();
const limits = { fileSize: 10_485_760 }; // TODO: use imported value

const fileFilter = (req, file, cb) => {
  const [type, extension] = file.mimetype.split("/");
  const allowedExtensions = ["jpeg", "png", "webp", "aviff", "svg"];

  if (type !== "image" || !allowedExtensions.includes(extension)) {
    cb(
      new FileTypeNotAllowedError(
        "Only jpeg, png, webp, aviff and svg files are allowed" // TODO: use imported value
      ),
      true
    );
  }

  cb(null, true);
};

const upload = multer({
  storage,
  limits,
  fileFilter,
});

const getUploadedImageMiddleware = upload.single("image");

export default function validateUploadedFile(requireFile = false) {
  return (req, res, next) => {
    getUploadedImageMiddleware(req, res, (err) => {
      let detail;

      if (err instanceof multer.MulterError) {
        detail = "Max upload size of 10MiB reached"; // TODO: use imported value
      }

      if (err instanceof FileTypeNotAllowedError) {
        detail = "Only jpeg, png, webp, aviff and svg files are allowed"; // TODO: use imported value
      }

      if (requireFile && !req.file) {
        detail = "Image file is required";
      }

      if (detail) {
        return res.status(httpStatus.UNPROCESSABLE_ENTITY).send({ detail });
      }

      next();
    });
  };
}
