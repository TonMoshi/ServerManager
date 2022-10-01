import express from "express";
const router = express.Router();
import { executeComandBash } from "../controller/serverController";

router.get("/server", function (req, res) {
  executeComandBash();
});
export { router };
