const atProduction = process.env.MODE === "production";

const tokenCookieOptions = {
  httpOnly: true,
  sameSite: atProduction ? "None" : "Lax",
  secure: atProduction,
};

export default tokenCookieOptions;
