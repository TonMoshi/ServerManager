const { exec } = require("child_process");

const executeComandBash = (): any => {
  exec("bash ~/scritp.sh", (error, stdout, stderr) => {
    console.log(stdout);
    console.log(stderr);
    if (error !== null) {
      console.log(`exec error: ${error}`);
    }
  });
};

export { executeComandBash };
