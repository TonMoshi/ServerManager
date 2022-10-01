import express from "express";
const router = express.Router();
import { createServer, getTree } from "../controller/serverController";

router.post("/server", async function (req, res) {
  const { serverName } = req.body;
  await createServer(serverName);
  const response = await getTree();
  res.send(response);
});

router.get("/server", async function (req, res) {
  const response = await getTree();
  res.send(response);
});

export { router };
