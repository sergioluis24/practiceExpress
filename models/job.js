import jobs from "../jobs.json" with { type: "json" };

export class JobModel {
  static async addJob({
    titulo,
    empresa,
    ubicacion,
    descripcion,
    data,
    content,
  }) {
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
    return newJob;
  }

  static async getAll({ technology, modalidad, nivel, limit, offset, text }) {
    const filter = ({ technology, modalidad, nivel, limit, offset, text }) => {
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
    const jobsRecorted = filter({
      technology,
      modalidad,
      nivel,
      limit,
      offset,
      text,
    });
    return { jobs, jobsRecorted };
  }
  static async getById({ id }) {
    const jobUnique = jobs.find((job) => job.id === id);
    return jobUnique;
  }
  static async updateJob({ id, updatedJob }) {
    const jobIndex = jobs.findIndex((job) => job.id === id);

    jobs[jobIndex] = {
      id: id,
      ...updatedJob,
    };
    return jobs[jobIndex];
  }
  static async deleteJob({ id }) {
    const jobIndex = jobs.findIndex((job) => job.id === id);
    const deletedJob = jobs.splice(jobIndex, 1);
    return deletedJob[0];
  }

  static async verifyJob({ id }) {
    const jobIndex = jobs.findIndex((job) => job.id === id);

    return jobIndex;
  }
}
