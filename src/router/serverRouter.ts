import express from "express";
import { createFile } from "../controller/fileController";
const router = express.Router();
import {
  createServer,
  getServerList,
  getTree,
  installServer,
  uninstallServer,
} from "../controller/serverController";
import { checkRequestData } from "../interceptor/checks";
import { ERRORS } from "../model/errors.enum";
import { RequestParamType } from "../model/structures.enum";

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

router.post(
  "/server",
  checkRequestData(
    ["name", "serverName", "content", "type"],
    RequestParamType.BODY
  ),
  async function (req, res) {
    const { name, serverName, content, type } = req.body;

    // Creates the server file structure
    const resCreateServer = await createServer(serverName);
    if (resCreateServer.status === "KO") {
      res.status(ERRORS.HTTP_ERROR_500).send(resCreateServer.response);
    } else {
      // Generate if necesary the file and update it's content with the recieved
      const resCreateFile = await createFile(name, serverName, content, type);
      if (resCreateFile.status === "KO") {
        res.status(ERRORS.HTTP_ERROR_500).send(resCreateFile.response);
      } else {
        const responseTree = await getTree();
        if (responseTree.status === "KO") {
          res.status(ERRORS.HTTP_ERROR_500).send(responseTree.response);
        } else {
          res.send(responseTree);
        }
      }
    }
  }
);

router.post(
  "/server/install",
  checkRequestData(
    ["serverName", "startScript", "stopScript"],
    RequestParamType.BODY
  ),
  async function (req, res) {
    const { serverName, startScript, stopScript } = req.body;

    // Try to install the server
    const installServerRes = await installServer(
      serverName,
      startScript,
      stopScript
    );
    if (installServerRes.status === "KO") {
      res.status(ERRORS.HTTP_ERROR_500).send(installServerRes.response);
    } else {
      // Generate if necesary the file and update it's content with the recieved
      res.send(installServerRes.response);
    }
  }
);

router.post(
  "/server/uninstall",
  checkRequestData(["serverName"], RequestParamType.BODY),
  async function (req, res) {
    const { serverName } = req.body;

    // Try to install the server
    const uninstallServerRes = await uninstallServer(serverName);
    if (uninstallServerRes.status === "KO") {
      res.status(ERRORS.HTTP_ERROR_500).send(uninstallServerRes.response);
    } else {
      // Generate if necesary the file and update it's content with the recieved
      res.send(uninstallServerRes.response);
    }
  }
);

export { router };
