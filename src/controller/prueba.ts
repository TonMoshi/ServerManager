import express from "express";
const router = express.Router();
const { exec } = require("child_process");

const executeComandBash = (): any => {
  var yourscript = exec("bash ~/scritp.sh", (error, stdout, stderr) => {
    console.log(stdout);
    console.log(stderr);
    if (error !== null) {
      console.log(`exec error: ${error}`);
    }
  });
};

router.get("/games", function (req, res) {
  executeComandBash();
});
export { router };
