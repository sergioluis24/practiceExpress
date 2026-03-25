import { test, describe, before, after } from "node:test";

import assert from "node:assert";
import app from "./app.js";

const PORT = process.env.PORT_TEST || 4567;

const BASE_URL = `http://localhost:${PORT}`;

let server;

before(async () => {
  await new Promise((resolve, reject) => {
    server = app.listen(PORT, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
});
after(async () => {
  await new Promise((resolve, reject) => {
    server.close((err) => {
      if (err) return reject(err);
      resolve();
    });
  });
});
describe("GET /jobs", () => {
  test("Deberia devolver un array de jobs", async () => {
    const res = await fetch(BASE_URL + "/jobs");
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    const data = json.data;
    assert.ok(Array.isArray(data), "Deberia devolver un array");
  });
});
