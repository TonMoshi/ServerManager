const util = require("util");
const exec = util.promisify(require("child_process").exec);

import { commands } from "../model/commands";

const createServer = async (serverName: String): Promise<any> => {
  try {
    const { stdout, stderr } = await exec(
      commands.createFolderHierarchy(serverName)
    );
    return stdout;
  } catch (error) {
    console.error(error);
    return null;
  }
};
const createFile = async (
  fileName: String,
  message: String,
  type: String
): Promise<any> => {
  try {
    const filePath = ``;
    const { stdout, stderr } = await exec(
      commands.comandTxt(fileName, message)
    );
    return stdout;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getTree = async (): Promise<any> => {
  try {
    const command = commands.generateBaseTree;
    const { stdout, stderr } = await exec(commands.generateBaseTree);
    return stdout;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export { createServer, getTree };
