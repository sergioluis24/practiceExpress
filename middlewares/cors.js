import cors from "cors";

const CORS_OPTIONS = {
  origin: (origin, callback) => {
    const allowed = ["http://localhost:5173", "http://insomnia.rest"];

    if (!origin || allowed.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("HOST NOT ALLOWED"));
    }
  },
};

export default ({ corsOptions = CORS_OPTIONS } = {}) => {
  return cors(corsOptions);
};
