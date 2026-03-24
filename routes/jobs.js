import { Router } from "express";

const jobsRouter = Router();

jobsRouter.get("/", (request, response) => {
  return response.send("Hola mundo desde express 😎");
});

jobsRouter.post("/", async (request, response) => {
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
jobsRouter.get("/health", (request, response) => {
  return response.send({
    status: "ok",
    uptime: `${Math.round(process.uptime())}`,
  });
});

jobsRouter.get("/", async (request, response) => {
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
jobsRouter.get("/:id", async (request, response) => {
  const { id } = request.params;
  const jobUnique = jobs.filter((job) => job.id === id);
  return response.json(jobUnique);
});

jobsRouter.put("/:id", async (request, response) => {
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

jobsRouter.delete("/:id", async (request, response) => {
  const { id } = request.params;
  const jobIndex = jobs.findIndex((job) => job.id === id);
  if (jobIndex === -1) {
    return response.status(404).json({ error: "Job not found" });
  }
  const deletedJob = jobs.splice(jobIndex, 1);
  return response.status(200).json(deletedJob[0]);
});
