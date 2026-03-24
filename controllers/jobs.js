import { JobModel } from "../models/job";

export class JobCrontroller {
  static async addJob(response, request) {
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

  static async getAll(response, request) {
    const {
      technology = "",
      modalidad = "",
      nivel = "",
      limit = DEFAULTS.limit,
      offset = DEFAULTS.offset,
      text = "",
    } = request.query;

    const jobsRecorted = await JobModel.getAll({
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
  static async getById(response, request) {
    const { id } = request.params;
    const jobUnique = JobModel.getById({ id });
    return response.json(jobUnique);
  }
  static async updateJob(response, reuest) {
    const { id } = request.params;
    const jobIndex = JobModel.verifyJob({ id });
    if (jobIndex === -1) {
      return response.status(404).json({ error: "Job not found" });
    }
    const update = request.body;

    const updatedJob = JobModel.updateJob({ id, update });

    return response.status(200).json(updatedJob);
  }
  static async deleteJob(response, request) {
    const { id } = request.params;

    const jobIndex = JobModel.verifyJob({ id });
    if (jobIndex === -1) {
      return response.status(404).json({ error: "Job not found" });
    }
    const deletedJob = JobModel.deleteJob({ id });
    return response.status(200).json(deletedJob);
  }
}
