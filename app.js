import express from "express";
import jobsRouter from "./routes/jobs.js";
import jobs from "./jobs.json" with { type: "json" };
import cors from "./midleWares/cors.js";
import { DEFAULTS } from "./config.js";
const PORT = process.env.PORT || 1234;
const app = express();
app.use(express.json());

// CORS
app.use(cors());
app.use("/jobs", jobsRouter);

app.listen(PORT, () => {
  console.log(`Escuchando en el puerto http://localhost:${PORT}`);
});
