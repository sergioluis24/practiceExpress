import { Router } from "express";
import { JobController } from "../controllers/jobs.js";
import { validateJobs, validateJobsPartial } from "../schemes/jobs.js";

const jobsRouter = Router();

function validateCreateJob(request, response, next) {
  const result = validateJobs(request.body);

  if (result.success) {
    request.body = result.data;
    return next();
  }
  return response.status(400).json({
    status: 400,
    message: result.error.issues[0].message,
  });
}
function validateUpdate(request, response, next) {
  const result = validateJobsPartial(request.body);

  if (result.success) {
    request.body = result.data;
    return next();
  }
  return response.status(400).json({
    status: 400,
    message: result.error.issues[0].message,
  });
}

jobsRouter.post("/", validateCreateJob, JobController.addJob);
jobsRouter.get("/health", (request, response) => {
  return response.send({
    status: "ok",
    uptime: `${Math.round(process.uptime())}`,
  });
});

jobsRouter.get("/", JobController.getAll);
jobsRouter.get("/:id", JobController.getById);

jobsRouter.put("/:id", validateJobsPartial, JobController.updateJob);

jobsRouter.delete("/:id", JobController.deleteJob);

export default jobsRouter;
