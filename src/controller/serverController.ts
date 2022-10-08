import config from "../util/config";
import { commands } from "../model/commands";
import { FileTypes } from "../model/structures.enum";
import { getFileByTipe, sanitizeNewLineForEcho } from "../util/utils";
import { EXECUTE, iExecData } from "../util/exec";

const createServer = async (serverName: String): Promise<iExecData> => {
  return await EXECUTE(commands.createFolderHierarchy(serverName));
};
const createFile = async (
  fileName: String,
  serverName: String,
  content: String,
  type: FileTypes
): Promise<any> => {
  const filePath = getFileByTipe(serverName, type, fileName);
  return await EXECUTE(
    commands.setFileContent(filePath, sanitizeNewLineForEcho(content))
  );
};

const getTree = async (): Promise<iExecData> => {
  return await EXECUTE(commands.generateBaseTree);
};

export { createServer, getTree, createFile };
