import express from "express";
import config from "./util/config";
import cors from "cors";
import { checkAuth } from "./interceptor/checks";

const app = express();

import { router as serveRoutes } from "./router/serverRouter";
import { router as fileRoutes } from "./router/fileRouter";

const allowedOrigins = ["http://localhost:4200"];
const options: cors.CorsOptions = { origin: allowedOrigins };

app.use(cors(options));
app.use(checkAuth);
app.use(express.json());
app.use(serveRoutes);
app.use(fileRoutes);

app.listen(config.PORT, () => {
  return console.log(`server is listening on ${config.PORT}`);
});
