import z from "zod";

export const jobsSchema = z.object({
  title: z
    .string()
    .min(3, "Nombre de la posicion muy corto")
    .max(50, "Nombre de la posición muy largo"),
  description: z.string().optional(),
  ubicacion: z.string(),
  data: z.object({
    technology: z.array(z.string()),
    modalidad: z.enum([
      "remoto",
      "cdmx",
      "monterrey",
      "santiago",
      "bogota",
      "valencia",
      "lima",
    ]),
    nivel: z.enum(["junior", "mid-level", "senior"]),
  }),
});

export const validateJobs = (input) => {
  return jobsSchema.safeParse(input);
};
export const validateJobsPartial = (input) => {
  return jobsSchema.partial().safeParse(input);
};
