import multer from "multer";
import FileTypeNotAllowedError from "../errors/FileTypeNotAllowedError.js";

const storage = multer.memoryStorage();
const limits = { fileSize: 10_485_760 };

const fileFilter = (req, file, cb) => {
  const [type, extension] = file.mimetype.split("/");
  const allowedExtensions = ["jpeg", "png", "webp", "aviff", "svg"];

  if (type !== "image" || !allowedExtensions.includes(extension)) {
    cb(
      new FileTypeNotAllowedError(
        "Only jpeg, png, webp, aviff and svg files are allowed"
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
      if (err instanceof multer.MulterError) {
        return res
          .status(422)
          .send({ detail: "Max upload size of 10MiB reached" });
      }

      if (err instanceof FileTypeNotAllowedError) {
        return res.status(422).send({
          detail: "Only jpeg, png, webp, aviff and svg files are allowed",
        });
      }

      if (requireFile && !req.file) {
        return res.status(422).send({ detail: "Image file is required" });
      }

      next();
    });
  };
}
