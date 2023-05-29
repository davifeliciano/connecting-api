const allowedOrigins = [
  process.env.ORIGIN0,
  process.env.ORIGIN1,
  process.env.ORIGIN2,
];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS."));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

export default corsOptions;
