export default class BadPasswordError extends Error {
  constructor(message) {
    super(message);
    this.name = "BadPasswordError";
  }
}
