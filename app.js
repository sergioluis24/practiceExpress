import express from "express";
import jobsRouter from "./routes/jobs.js";
import aiRouter from "./routes/ai.js";
import fs from "fs";
const jobs = JSON.parse(fs.readFileSync(new URL("./jobs.json", import.meta.url), "utf8"));
import middlewareCors from "./middlewares/cors.js";
import { DEFAULTS } from "./config.js";
const PORT = process.env.PORT || 1234;
const app = express();
app.use(express.json());
app.get("/health", (request, response) => {
  return response.send({
    status: "ok",
    uptime: `${Math.round(process.uptime())}`,
  });
});

// CORS
app.use(middlewareCors());
app.use("/jobs", jobsRouter);
app.use("/summary", aiRouter);
if (process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Escuchando en el puerto http://localhost:${PORT}`);
  });
}

export default app;
