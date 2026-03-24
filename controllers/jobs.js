import { JobModel } from "../models/job.js";
import { DEFAULTS } from "../config.js";

export class JobController {
  static async addJob(request, response) {
    const { titulo, empresa, ubicacion, descripcion, data, content } =
      request.body;
    const newJob = await JobModel.addJob({
      titulo,
      empresa,
      ubicacion,
      descripcion,
      data,
      content,
    });
    return response.status(201).json(newJob);
  }

  static async getAll(request, response) {
    const {
      technology = "",
      modalidad = "",
      nivel = "",
      limit = DEFAULTS.limit,
      offset = DEFAULTS.offset,
      text = "",
    } = request.query;

    const { jobs, jobsRecorted } = await JobModel.getAll({
      technology,
      modalidad,
      nivel,
      limit,
      offset,
      text,
    });
    return response.json({
      data: jobsRecorted,
      results: jobs.length,
      total: jobs.length,
      limit: DEFAULTS.limit,
      offset: DEFAULTS.offset,
    });
  }
  static async getById(request, response) {
    const { id } = request.params;
    const jobUnique = await JobModel.getById({ id });
    return response.json(jobUnique);
  }
  static async updateJob(request, response) {
    const { id } = request.params;
    const jobIndex = await JobModel.verifyJob({ id });
    if (jobIndex === -1) {
      return response.status(404).json({ error: "Job not found" });
    }
    const update = request.body;

    const updatedJob = await JobModel.updateJob({ id, updatedJob: update });

    return response.status(200).json(updatedJob);
  }
  static async deleteJob(request, response) {
    const { id } = request.params;

    const jobIndex = await JobModel.verifyJob({ id });
    if (jobIndex === -1) {
      return response.status(404).json({ error: "Job not found" });
    }
    const deletedJob = await JobModel.deleteJob({ id });
    return response.status(200).json(deletedJob);
  }
}
