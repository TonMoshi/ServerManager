import express from "express";
const router = express.Router();
import {
  createFile,
  createServer,
  getTree,
} from "../controller/serverController";
import { checkRequestData } from "../interceptor/checks";
import { ERRORS } from "../model/errors.enum";
import { RequestParamType } from "../model/structures.enum";

router.post(
  "/server",
  checkRequestData(
    ["fileName", "serverName", "message", "type"],
    RequestParamType.BODY
  ),
  async function (req, res) {
    const { fileName, serverName, message, type } = req.body;

    // Creates the server file structure
    const resCreateServer = await createServer(serverName);
    if (resCreateServer.status === "KO") {
      res.status(ERRORS.HTTP_ERROR_500).send(resCreateServer.response);
    }

    // Generate if necesary the file and update it's content with the recieved
    const resCreateFile = await createFile(fileName, serverName, message, type);
    if (resCreateFile.status === "KO") {
      res.status(ERRORS.HTTP_ERROR_500).send(resCreateFile.response);
    }

    const responseTree = await getTree();
    if (responseTree.status === "KO") {
      res.status(ERRORS.HTTP_ERROR_500).send(responseTree.response);
    }

    res.send(responseTree.response);
  }
);

router.get("/server", async function (req, res) {
  const response = await getTree();
  res.send(response);
});

export { router };
