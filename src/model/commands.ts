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
    `${commands.sudo} mkdir -p ${getMainFolder()}/${serverName}/${
      config.SERVER
    } ` +
    `&& ${commands.sudo} mkdir -p ${getFileByTipe(
      serverName,
      FileTypes.SCRIPT,
      ""
    )} ` +
    `&& ${commands.sudo} touch ${getFileByTipe(
      serverName,
      FileTypes.SCRIPT,
      "start.sh"
    )} ` +
    `&& ${commands.sudo} chmod 7777 ${getFileByTipe(
      serverName,
      FileTypes.SCRIPT,
      "start.sh"
    )} ` +
    `&& ${commands.sudo} touch ${getFileByTipe(
      serverName,
      FileTypes.SCRIPT,
      "stop.sh"
    )} ` +
    `&& ${commands.sudo} chmod 7777 ${getFileByTipe(
      serverName,
      FileTypes.SCRIPT,
      "stop.sh"
    )} ` +
    `&& ${commands.sudo} mkdir -p ${getFileByTipe(
      serverName,
      FileTypes.LOG,
      ""
    )}` +
    `&& ${commands.sudo} touch ${getFileByTipe(
      serverName,
      FileTypes.LOG,
      "main.log"
    )}`,

  generateBaseTree: `tree ${getMainFolder()}`,
  installServer: (
    serverName: string,
    startScript: IScriptInput,
    stopScript: IScriptInput
  ) =>
    `${commands.sudo} touch ${SERVICE_PATH}/${serverName}.service ` +
    `&& ${commands.setFileContent(
      SERVICE_PATH + "/" + serverName + ".service",
      serviceTemplate(
        config.USER,
        getMainFolder() + "/" + serverName + "/" + config.SCRIPTS,
        startScript,
        stopScript
      )
    )} ` +
    //`&& ${commands.sudo} systemctl daemon-reload ` +
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
  listServers: () => `ls ${getMainFolder()}/`,
  listFiles: (serverName: string, type: FileTypes) =>
    `ls ${getFolderByTipe(serverName, type)}`,
  readFile: (fileName: String, serverName: String, type: FileTypes) =>
    `cat ${getFileByTipe(serverName, type, fileName)}`,
};

function getMainFolder() {
  return `/usr/bin${config.MAIN_FOLDER}`;
}
