const util = require("util");
const exec = util.promisify(require("child_process").exec);

export interface iExecData {
  status: String;
  response: String;
}

export const EXECUTE = async (command): Promise<iExecData> => {
  try {
    const { stdout } = await exec(command);
    return {
      status: "OK",
      response: stdout,
    };
  } catch (error) {
    console.error(error);
    return {
      status: "KO",
      response: error,
    };
  }
};
