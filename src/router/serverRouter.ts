import express from "express";
const router = express.Router();
import {
  createFile,
  createServer,
  getTree,
} from "../controller/serverController";

router.post("/server", async function (req, res) {
  const { fileName, serverName, message, type } = req.body;
  await createServer(serverName);
  await createFile(fileName, serverName, message, type);
  const response = await getTree();
  res.send(response);
});

router.get("/server", async function (req, res) {
  const response = await getTree();
  res.send(response);
});

export { router };
