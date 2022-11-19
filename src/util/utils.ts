import config from "./config";
import { FileTypes } from "../model/structures.enum";

export const getFolderByTipe = (serverName: String, type: FileTypes): String =>
  `${config.MAIN_FOLDER}/${serverName}/${
    type === FileTypes.LOG ? config.LOG : config.SCRIPTS
  }/`;

export const getFileByTipe = (
  serverName: String,
  type: FileTypes,
  fileName: String
): String =>
  `/home/${config.USER}${config.MAIN_FOLDER}/${serverName}/${
    type === FileTypes.LOG ? config.LOG : config.SCRIPTS
  }/${fileName}`;

export const sanitizeNewLineForEcho = (text: String): String =>
  text.replace(/[\r\n]/gm, " && echo ");
