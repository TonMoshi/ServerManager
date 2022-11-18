import config from "../util/config";
import { commands } from "../model/commands";
import { FileTypes } from "../model/structures.enum";
import { getFileByTipe, sanitizeNewLineForEcho } from "../util/utils";
import { EXECUTE, iExecData } from "../util/exec";
import { IFile, IServer } from "../model/server.interface";

const createServer = async (serverName: String): Promise<iExecData> => {
  return await EXECUTE(commands.createFolderHierarchy(serverName));
};

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

const getTree = async (): Promise<iExecData> => {
  return await EXECUTE(commands.generateBaseTree);
};

const getServerList = async (): Promise<{
  serverList: IServer[];
  error: any;
}> => {
  return new Promise(async (resolve, reject) => {
    const serverNames = await EXECUTE(commands.listServers());
    const serverList = [];
    if (serverNames.status === "KO") {
      resolve({ serverList: [], error: serverNames.response });
    } else {
      const serverNameList = serverNames.response.split("\n");

      for (let index = 0; index < serverNameList.length; index++) {
        const server = await getServerWithFilesAndContent(
          serverNameList[index]
        );
        serverList.push(server);
      }
    }
    resolve({ serverList, error: false });
  });
};

async function getServerWithFilesAndContent(serverName: string) {
  return new Promise(async (resolve, reject) => {
    let server: IServer = {
      name: serverName,
      logs: [],
      scripts: [],
    };
    server.scripts = await getFilesContent(serverName, FileTypes.SCRIPT);
    server.logs = await getFilesContent(serverName, FileTypes.LOG);
    resolve(server);
  });
}

async function getFilesContent(
  serverName: string,
  type: FileTypes
): Promise<IFile[]> {
  return new Promise(async (resolve, reject) => {
    let files: IFile[] = [];

    const fileNames = await EXECUTE(
      commands.listFiles(serverName, FileTypes.SCRIPT)
    );
    if (fileNames.status === "OK") {
      const fileNamesList = fileNames.response.split("\n");

      for (let index = 0; index < fileNamesList.length; index++) {
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

export {
  createServer,
  getTree,
  createFile,
  executeScript,
  readFile,
  getServerList,
};
