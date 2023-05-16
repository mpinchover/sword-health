import express, { Express, Request, Response } from "express";
import Handler from "./src/handlers";

import { authenticateToken, setBodyData } from "./src/middleware";
const cors = require("cors")({ origin: true });

const app: Express = express();
app.use(cors);
app.use(express.json());

const h = new Handler();

const setupSubscribers = async () => {
  await h.setupRedisSubscribers();
};
setupSubscribers();

// @ts-ignore
app.get("/test", h.test);

// @ts-ignore
app.get("/test2", async (req: any, res: any) => {
  try {
    res.send({ msg: process.env.TASK_MANAGER_SQL_HOST });
  } catch (e) {
    res.status(501).send(e);
  }
});

// @ts-ignore
app.post("/create-task", setBodyData, authenticateToken, h.createTask);

// @ts-ignore
app.post("/update-task", setBodyData, authenticateToken, h.updateTask);

// @ts-ignore
app.post("/delete-task", setBodyData, authenticateToken, h.deleteTask);

// @ts-ignore
app.get("/get-tasks", authenticateToken, h.getTasks);

// @ts-ignore
app.post("/create-user", setBodyData, h.createUser);

// @ts-ignore
app.post("/login-user", setBodyData, h.loginUser);

app.listen(process.env.APP_PORT, () => {
  console.log(
    `⚡️[server]: Server is running at http://localhost:${process.env.APP_PORT}`
  );
});
