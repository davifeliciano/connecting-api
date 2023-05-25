export default class RefreshTokenReuseError extends Error {
  constructor(message) {
    super(message);
    this.name = "RefreshTokenReuseError";
  }
}
