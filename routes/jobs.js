import { Router } from "express";
import { JobController } from "../controllers/jobs.js";

const jobsRouter = Router();

jobsRouter.post("/", JobController.addJob);
jobsRouter.get("/health", (request, response) => {
  return response.send({
    status: "ok",
    uptime: `${Math.round(process.uptime())}`,
  });
});

jobsRouter.get("/", JobController.getAll);
jobsRouter.get("/:id", JobController.getById);

jobsRouter.put("/:id", JobController.updateJob);

jobsRouter.delete("/:id", JobController.deleteJob);

export default jobsRouter;
