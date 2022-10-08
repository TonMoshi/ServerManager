import config from "./config";
import { FileTypes } from "../model/structures.enum";

export const getFileByTipe = (
  serverName: String,
  type: FileTypes,
  fileName: String
): String =>
  `${config.MAIN_FOLDER}/${serverName}/${
    type === FileTypes.LOG ? config.LOG : config.SCRIPTS
  }/${fileName}`;

export const sanitizeNewLineForEcho = (text: String): String =>
  text.replace(/[\r\n]/gm, " && echo ");
