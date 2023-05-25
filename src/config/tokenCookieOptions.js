const tokenCookieOptions = {
  httpOnly: true,
  sameSite: "None",
  secure: process.env.MODE === "production",
};

export default tokenCookieOptions;
