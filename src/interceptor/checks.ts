import { RequestParamType } from "../model/structures.enum";

const checkAuth = (req, res, next) => {
  console.log("Time: ", Date.now());
  if (!req.headers.authorization) {
    res.status(401).send("Añade el bearer token en authoritation");
  } else {
    next();
  }
};

const checkRequestData = (requiredParams: string[], type: RequestParamType) => {
  return (req, res, next) => {
    let errors = [];
    for (let param of requiredParams) {
      if (
        (type === RequestParamType.QUERY && req.query[param] === undefined) ||
        (type === RequestParamType.BODY && req.body[param] === undefined)
      ) {
        errors.push(`Falta un parámetro obligatorio: ${param}`);
      }
    }

    if (errors.length) {
      res.status(401).send(errors);
    } else {
      next();
    }
  };
};

export { checkAuth, checkRequestData };
