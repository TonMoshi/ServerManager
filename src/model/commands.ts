import config from "../util/config";

export const commands = {
  createFolderHierarchy: (serverName: String) =>
    `mkdir -p ${config.MAIN_FOLDER}/${serverName}/Server ${config.MAIN_FOLDER}/${serverName}/Logs ${config.MAIN_FOLDER}/${serverName}/Scripts`,

  generateBaseTree: `tree ${config.MAIN_FOLDER}`,

  comandTxt: (filePath: String, message: String) =>
    `echo ${message} > ${filePath}`,
};
