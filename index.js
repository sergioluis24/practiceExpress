import express from "express";

const PORT = process.env.PORT || 1234;
const app = express();

app.get("/", (request, response) => {
  return response.send("Hola mundo desde express 😎");
});

app.listen(PORT, () => {
  console.log(`Escuchando en el puerto http://localhost:${PORT}`);
});
