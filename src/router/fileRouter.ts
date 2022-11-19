import express from "express";
import { executeScript, readFile } from "../controller/fileController";
const router = express.Router();
import { checkRequestData } from "../interceptor/checks";
import { ERRORS } from "../model/errors.enum";
import { FileTypes, RequestParamType } from "../model/structures.enum";

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
