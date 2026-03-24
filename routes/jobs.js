import { Router } from "express";
import { JobCrontroller } from "../controllers/jobs";

const jobsRouter = Router();

jobsRouter.post("/", JobCrontroller.addJob);
jobsRouter.get("/health", (request, response) => {
  return response.send({
    status: "ok",
    uptime: `${Math.round(process.uptime())}`,
  });
});

jobsRouter.get("/", JobCrontroller.getAll);
jobsRouter.get("/:id", JobCrontroller.getById);

jobsRouter.put("/:id", JobCrontroller.updateJob);

jobsRouter.delete("/:id", JobCrontroller.deleteJob);
