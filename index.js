import express, { response } from "express";
import jobs from "./jobs.json" with { type: "json" };
import { DEFAULTS } from "./conifg.js";
const PORT = process.env.PORT || 1234;
const app = express();

const filter = (request, response, jobs) => {
  const { technology } = request.query;

  if (technology) {
    const jobsFiltered = jobs.filter((job) =>
      job.data.technology.includes(technology),
    );
    return jobsFiltered;
  }

  return jobs;
};

app.get("/", (request, response) => {
  return response.send("Hola mundo desde express 😎");
});

app.get("/health", (request, response) => {
  return response.send({
    status: "ok",
    uptime: `${Math.round(process.uptime())}`,
  });
});

app.get("/jobs", async (request, response) => {
  // const jobs = await import("./jobs.json", { with: { type: "json" } });
  const { limit = DEFAULTS.limit, offset = DEFAULTS.offset } = request.query;

  const limitNumber = Number(limit);
  const offsetNumber = Number(offset);

  const jobsFiltered = filter(request, response, jobs);
  const jobsRecorted = jobsFiltered.slice(
    offsetNumber,
    offsetNumber + limitNumber,
  );
  return response.json(jobsRecorted);
});

app.get("/jobs/:id", async (request, response) => {
  const { id } = request.params;
  const jobUnique = jobs.filter((job) => job.id === id);
  return response.json(jobUnique);
});

app.listen(PORT, () => {
  console.log(`Escuchando en el puerto http://localhost:${PORT}`);
});
