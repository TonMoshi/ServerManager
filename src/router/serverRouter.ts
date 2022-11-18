import express from "express";
const router = express.Router();
import {
  createFile,
  createServer,
  executeScript,
  getServerList,
  getTree,
  readFile,
} from "../controller/serverController";
import { checkRequestData } from "../interceptor/checks";
import { ERRORS } from "../model/errors.enum";
import { FileTypes, RequestParamType } from "../model/structures.enum";

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
    } else {
      // Generate if necesary the file and update it's content with the recieved
      const resCreateFile = await createFile(
        fileName,
        serverName,
        message,
        type
      );
      if (resCreateFile.status === "KO") {
        res.status(ERRORS.HTTP_ERROR_500).send(resCreateFile.response);
      } else {
        const responseTree = await getTree();
        if (responseTree.status === "KO") {
          res.status(ERRORS.HTTP_ERROR_500).send(responseTree.response);
        } else {
          res.send(responseTree.response);
        }
      }
    }
  }
);

router.get("/tree", async function (req, res) {
  const response = await getTree();
  res.send(response);
});

router.get("/server", async function (req, res) {
  const response = await getServerList();
  if (response.error) {
    res.status(ERRORS.HTTP_ERROR_500).send(response.error);
  } else {
    res.send(response.serverList);
  }
});

router.get("/file", async function (req, res) {
  const { fileName, serverName, type } = req.query;
  const fileContent = await readFile(
    fileName as String,
    serverName as String,
    type as FileTypes
  );
  res.send(fileContent);
});

router.post(
  "/script",
  checkRequestData(
    ["fileName", "serverName", "parameters"],
    RequestParamType.BODY
  ),
  async function (req, res) {
    const { fileName, serverName, parameters } = req.body;
    const resCreateServer = await executeScript(
      fileName,
      serverName,
      parameters
    );
    if (resCreateServer.status === "KO") {
      res.status(ERRORS.HTTP_ERROR_500).send(resCreateServer.response);
    } else {
      res.send(resCreateServer.response);
    }
  }
);

export { router };
