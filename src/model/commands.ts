import config from "../util/config";

export const commands = {
  createFolderHierarchy: (serverName: String) =>
    `mkdir -p ${config.MAIN_FOLDER}/${serverName}/${config.SERVER} ${config.MAIN_FOLDER}/${serverName}/${config.SCRIPTS} ${config.MAIN_FOLDER}/${serverName}/${config.LOG}`,

  generateBaseTree: `tree ${config.MAIN_FOLDER}`,

  setFileContent: (filePath: String, content: String) =>
    `(echo ${content}) > ${filePath}`,
};
