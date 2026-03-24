import express from "express";
import jobsRouter from "./routes/jobs.js";
import jobs from "./jobs.json" with { type: "json" };
import middlewareCors from "./middlewares/cors.js";
import { DEFAULTS } from "./config.js";
const PORT = process.env.PORT || 1234;
const app = express();
app.use(express.json());

// CORS
app.use(middlewareCors());
app.use("/jobs", jobsRouter);
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Escuchando en el puerto http://localhost:${PORT}`);
  });
}

export default app;
