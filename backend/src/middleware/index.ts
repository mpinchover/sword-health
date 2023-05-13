import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, "test", (err: any, user: any) => {
    console.log(err);
    if (err) return res.sendStatus(403);

    // @ts-ignore
    req.userUuid = user.uuid;
    next();
  });
};

export const setBodyData = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  for (const [key, value] of Object.entries(req.body)) {
    // @ts-ignore
    req[key] = value;
  }
  next();
};
