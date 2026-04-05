import OpenAI from "openai";
import { Router } from "express";
import { JobModel } from "../models/job.js";
process.loadEnvFile();
const aiRouter = Router();
let openai;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

aiRouter.get("/health", (request, response) => {
  return response.send({
    status: "ok",
    uptime: `${Math.round(process.uptime())}`,
  });
});

aiRouter.get("/:id", async (req, res) => {
  const job = await JobModel.getById({ id: req.params.id });

  if (!job) {
    return res.status(404).json({ error: "Job not found" });
  }
  console.log("apikey", process.env.OPENAI_API_KEY);
  // If OpenAI is configured, try to generate a summary; otherwise return a fallback summary
  if (openai) {
    try {
      const systemMessage = `Eres un asistente que solo resume ofertas de trabajo en un máximo de 200 palabras. Si el texto es demasiado corto, devuelve el texto sin resumir. No devuelvas nada más que el resumen.`;
      const userMessage = `Resume el siguiente puesto de trabajo. Título: ${job.titulo || ""}. Empresa: ${job.empresa || ""}. Ubicación: ${job.ubicacion || ""}. Tecnologías: ${job.data?.technology?.join(", ") || ""}. Nivel: ${job.data?.nivel || ""}. Descripción: ${job.descripcion || ""}`;

      const response = await openai.chat.completions.create({
        model: "gpt-5.4",
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: userMessage },
        ],
        max_tokens: 200,
      });

      const summary = response?.choices?.[0]?.message?.content || "";
      return res.json({ summary });
    } catch (error) {
      console.error("Error generating summary via OpenAI:", error);
      // fall through to local fallback
    }
  }

  // Fallback: return first ~100 words of the description
  return res.json({ error: "El resumen no está disponible." });
});

export default aiRouter;
