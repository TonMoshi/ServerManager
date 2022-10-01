import express from "express";

const app = express();

import { router as gamesRoutes } from "./controller/prueba";
const allowedOrigins = ["http://localhost:3000"];

app.use(express.json());

app.use(gamesRoutes);

app.listen(3000, () => {
  return console.log(`server is listening on 50`);
});
