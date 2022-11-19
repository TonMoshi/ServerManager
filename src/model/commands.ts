import config from "../util/config";
import { getFileByTipe, getFolderByTipe } from "../util/utils";
import { IScriptInput, serviceTemplate } from "./service.template";
import { FileTypes } from "./structures.enum";

const SERVICE_PATH = `/etc/systemd/system`;

export const commands = {
  maxSudo: `sudo visudo => ${config.USER} ALL=(ALL) NOPASSWD:ALL`,
  sudo: `echo ${config.USERPASSW} | sudo -S `,
  whoami: `whoami`,
  createFolderHierarchy: (serverName: String) =>
    `mkdir -p ${getMainFolder()}/${serverName}/${config.SERVER} ` +
    `&& mkdir -p ${getFileByTipe(serverName, FileTypes.SCRIPT, "")} ` +
    `&& touch ${getFileByTipe(serverName, FileTypes.SCRIPT, "start.sh")} ` +
    `&& ${commands.sudo} chmod 7777 ${getFileByTipe(
      serverName,
      FileTypes.SCRIPT,
      "start.sh"
    )} ` +
    `&& touch ${getFileByTipe(serverName, FileTypes.SCRIPT, "stop.sh")} ` +
    `&& ${commands.sudo} chmod 7777 ${getFileByTipe(
      serverName,
      FileTypes.SCRIPT,
      "stop.sh"
    )} ` +
    `&& mkdir -p ${getFileByTipe(serverName, FileTypes.LOG, "")}` +
    `&& touch ${getFileByTipe(serverName, FileTypes.LOG, "main.log")}`,

  generateBaseTree: `tree ${getMainFolder()}`,
  installServer: (
    serverName: string,
    startScript: IScriptInput,
    stopScript: IScriptInput
  ) =>
    `${commands.sudo} touch ${SERVICE_PATH}/${serverName}.service` +
    `&& ${commands.setFileContent(
      SERVICE_PATH + "/" + serverName + ".service",
      serviceTemplate(
        config.USER,
        getMainFolder() + "/" + serverName + "/" + config.SCRIPTS,
        startScript,
        stopScript
      )
    )} ` +
    `&& ${commands.sudo} service ${serverName} start ` +
    `&& ${commands.sudo} service ${serverName} enable ` +
    `&& ${commands.sudo} service ${serverName} status `,
  uninstallServer: (serverName: string) => `
    service ${serverName} stop
     && service ${serverName} disable
  `,

  setFileContent: (filePath: String, content: String) =>
    `sudo sh -c 'echo "${content}" > ${filePath}'`,

  executeScriptCommand: (
    fileName: String,
    serverName: String,
    parameters: String[]
  ) =>
    `sh ${getMainFolder()}/${serverName}/Scripts/${fileName} ${parameters.join(
      " "
    )}`,
  listServers: () => `ls ${config.MAIN_FOLDER}/`,
  listFiles: (serverName: string, type: FileTypes) =>
    `ls ${getFolderByTipe(serverName, type)}`,
  readFile: (fileName: String, serverName: String, type: FileTypes) =>
    `cat ${getFileByTipe(serverName, type, fileName)}`,
};

function getMainFolder() {
  return `/home/${config.USER}${config.MAIN_FOLDER}`;
}
