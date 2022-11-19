import { FileTypes } from "./structures.enum";

export interface IServer {
  name: string;
  logs: IFile[];
  scripts: IFile[];
}
export interface IFile {
  serverName: string;
  type: FileTypes;
  name: string;
  content: string;
}
