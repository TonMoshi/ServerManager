import express from "express";
import config from "./util/config";
import { checkAuth } from "./interceptor/checks";

const app = express();

import { router as serverRoutes } from "./router/serverRouter";

app.use(checkAuth);

app.use(express.json());
app.use(serverRoutes);

app.listen(config.PORT, () => {
  return console.log(`server is listening on ${config.PORT}`);
});
