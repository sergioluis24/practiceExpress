import express, { response } from "express";
import jobs from "./jobs.json" with { type: "json" };
import { DEFAULTS } from "./config.js";
const PORT = process.env.PORT || 1234;
const app = express();

const filter = (request, response, jobs) => {
  const {
    technology = "",
    limit = DEFAULTS.limit,
    offset = DEFAULTS.offset,
    text = "",
  } = request.query;

  const limitNumber = Number(limit);
  const offsetNumber = Number(offset);

  const jobsFiltered =
    technology !== ""
      ? jobs.filter((job) =>
          job.data.technology.toLowerCase().includes(technology.toLowerCase()),
        )
      : jobs;
  const jobsFilterWhitText =
    text !== ""
      ? jobsFiltered.filter(
          (job) =>
            job.titulo.toLowerCase().includes(text.toLowerCase()) ||
            job.descripcion.toLowerCase().includes(text.toLowerCase()),
        )
      : jobsFiltered;

  const jobsRecorted = jobsFilterWhitText.slice(
    offsetNumber,
    offsetNumber + limitNumber,
  );
  return jobsRecorted;
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
  const jobsRecorted = filter(request, response, jobs);
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
