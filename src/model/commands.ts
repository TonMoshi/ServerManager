import config from "../util/config";
import { getFileByTipe, getFolderByTipe } from "../util/utils";
import { FileTypes } from "./structures.enum";

export const commands = {
  createFolderHierarchy: (serverName: String) =>
    `mkdir -p ${config.MAIN_FOLDER}/${serverName}/${config.SERVER} ` +
    `&& mkdir -p ${getFileByTipe(serverName, FileTypes.SCRIPT, "")} ` +
    `&& touch ${getFileByTipe(serverName, FileTypes.SCRIPT, "start.sh")} ` +
    `&& touch ${getFileByTipe(serverName, FileTypes.SCRIPT, "stop.sh")} ` +
    `&& mkdir -p ${getFileByTipe(serverName, FileTypes.LOG, "")}` +
    `&& touch ${getFileByTipe(serverName, FileTypes.LOG, "main.log")}`,

  generateBaseTree: `tree ${config.MAIN_FOLDER}`,

  setFileContent: (filePath: String, content: String) =>
    `(echo ${content}) > ${filePath}`,

  executeScriptCommand: (
    fileName: String,
    serverName: String,
    parameters: String[]
  ) =>
    `sh ${
      config.MAIN_FOLDER
    }/${serverName}/Scripts/${fileName} ${parameters.join(" ")}`,
  listServers: () => `ls ${config.MAIN_FOLDER}/`,
  listFiles: (serverName: string, type: FileTypes) =>
    `ls ${getFolderByTipe(serverName, type)}`,
  readFile: (fileName: String, serverName: String, type: FileTypes) =>
    `cat ${getFileByTipe(serverName, type, fileName)}`,
};
