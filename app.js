import express from "express";
import jobsRouter from "./routes/jobs.js";
import jobs from "./jobs.json" with { type: "json" };
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
if (process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Escuchando en el puerto http://localhost:${PORT}`);
  });
}

export default app;
