import { commands } from "../model/commands";
import { FileTypes } from "../model/structures.enum";
import { EXECUTE, iExecData } from "../util/exec";
import { IServer } from "../model/server.interface";
import { getFilesContent } from "./fileController";
import { IScriptInput } from "../model/service.template";

const createServer = async (serverName: String): Promise<iExecData> => {
  return await EXECUTE(commands.createFolderHierarchy(serverName));
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

const installServer = async (
  serverName: string,
  startScript: IScriptInput,
  stopScript: IScriptInput
): Promise<iExecData> => {
  return await EXECUTE(
    commands.installServer(
      serverName,
      { script: "start.sh", params: "" },
      { script: "stop.sh", params: "" }
    )
  );
};

const uninstallServer = async (serverName: string): Promise<iExecData> => {
  return await EXECUTE(commands.uninstallServer(serverName));
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

export { createServer, getTree, getServerList, installServer, uninstallServer };
