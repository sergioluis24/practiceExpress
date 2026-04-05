import express from "express";
import jobs from "./jobs.json" with { type: "json" };
import { DEFAULTS } from "./config.js";
import cors from "cors";
import crypto from "crypto";
const PORT = process.env.PORT || 1234;
const app = express();
app.use(express.json());

// CORS
const corsOptions = {
  origin: (origin, callback) => {
    const allowed = ["http://localhost:5173", "http://insomnia.rest"];

    if (!origin || allowed.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("HOST NOT ALLOWED"));
    }
  },
};
app.use(cors(corsOptions));

const filter = (request, response, jobs) => {
  const {
    technology = "",
    modalidad = "",
    nivel = "",
    limit = DEFAULTS.limit,
    offset = DEFAULTS.offset,
    text = "",
  } = request.query;

  const limitNumber = Number(limit);
  const offsetNumber = Number(offset);

  let jobsFiltered = jobs;

  if (technology !== "") {
    jobsFiltered = jobsFiltered.filter((job) =>
      job.data.technology.some((tech) =>
        tech.toLowerCase().includes(technology.toLowerCase()),
      ),
    );
  }

  if (modalidad !== "") {
    jobsFiltered = jobsFiltered.filter((job) =>
      job.data.modalidad.toLowerCase().includes(modalidad.toLowerCase()),
    );
  }

  if (nivel !== "") {
    jobsFiltered = jobsFiltered.filter((job) =>
      job.data.nivel.toLowerCase().includes(nivel.toLowerCase()),
    );
  }
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

app.post("/jobs", async (request, response) => {
  const { titulo, empresa, ubicacion, descripcion, data, content } =
    request.body;
  const newJob = {
    id: crypto.randomUUID(),
    titulo,
    empresa,
    ubicacion,
    descripcion,
    data,
    content,
  };
  jobs.push(newJob);
  return response.status(201).json(newJob);
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
  return response.json({
    data: jobsRecorted,
    results: jobs.length,
    total: jobs.length,
    limit: DEFAULTS.limit,
    offset: DEFAULTS.offset,
  });
});
app.get("/jobs/:id", async (request, response) => {
  const { id } = request.params;
  const jobUnique = jobs.filter((job) => job.id === id);
  return response.json(jobUnique);
});

app.put("/jobs/:id", async (request, response) => {
  const { id } = request.params;
  const jobIndex = jobs.findIndex((job) => job.id === id);
  if (jobIndex === -1) {
    return response.status(404).json({ error: "Job not found" });
  }
  const updatedJob = request.body;
  jobs[jobIndex] = {
    id: crypto.randomUUID(),
    updatedJob,
  };
  return response.status(200).json(updatedJob);
});

app.delete("/jobs/:id", async (request, response) => {
  const { id } = request.params;
  const jobIndex = jobs.findIndex((job) => job.id === id);
  if (jobIndex === -1) {
    return response.status(404).json({ error: "Job not found" });
  }
  const deletedJob = jobs.splice(jobIndex, 1);
  return response.status(200).json(deletedJob[0]);
});

app.listen(PORT, () => {
  console.log(`Escuchando en el puerto http://localhost:${PORT}`);
});
