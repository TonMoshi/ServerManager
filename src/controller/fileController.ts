import { commands } from "../model/commands";
import { IFile } from "../model/server.interface";
import { FileTypes } from "../model/structures.enum";
import { EXECUTE, iExecData } from "../util/exec";
import { getFileByTipe, sanitizeNewLineForEcho } from "../util/utils";

const executeScript = async (
  fileName: String,
  serverName: String,
  parameters: String[]
): Promise<iExecData> => {
  return await EXECUTE(
    commands.executeScriptCommand(fileName, serverName, parameters)
  );
};

const readFile = async (
  fileName: String,
  serverName: String,
  type: FileTypes
): Promise<iExecData> => {
  return await EXECUTE(commands.readFile(fileName, serverName, type));
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

async function getFilesContent(
  serverName: string,
  type: FileTypes
): Promise<IFile[]> {
  return new Promise(async (resolve, reject) => {
    let files: IFile[] = [];

    const fileNames = await EXECUTE(commands.listFiles(serverName, type));
    if (fileNames.status === "OK") {
      const fileNamesList = fileNames.response.split("\n");

      for (let index = 0; index < fileNamesList.length - 1; index++) {
        const fileContent = await EXECUTE(
          commands.readFile(fileNamesList[index], serverName, type)
        );
        if (fileContent.status === "OK") {
          files.push({
            serverName,
            type,
            name: fileNamesList[index],
            content: fileContent.response as string,
          });
        }
      }
    }

    resolve(files);
  });
}

export { createFile, executeScript, readFile, getFilesContent };
