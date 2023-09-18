export default class FileTypeNotAllowedError extends Error {
  constructor(message) {
    super(message);
    this.name = "FileTypeNotAllowedError";
  }
}
