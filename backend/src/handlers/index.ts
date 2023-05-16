import express, { Express, Request, Response } from "express";
import {
  validateCreateTask,
  validateCreateUser,
  validateDeleteTask,
  validateGetTasks,
  validateLoginUser,
  validateUpdateTask,
} from "../validation";
import {
  CreateTaskRequest,
  CreateUserRequest,
  DeleteTaskRequest,
  GetTasksRequest,
  LoginUserRequest,
  UpdateTaskRequest,
  User,
} from "../types";
import TaskController from "../controllers/task-controller";
import AuthController from "../controllers/auth-controller";
import * as CONSTANTS from "../utils/constants";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import RedisGateway from "../gateway/redis";

class Handler {
  private taskController: TaskController;
  private authController: AuthController;
  public redisGateway: RedisGateway;

  constructor() {
    this.taskController = new TaskController();
    this.authController = new AuthController();
    this.redisGateway = new RedisGateway();
  }

  setupRedisSubscribers = async () => {
    await this.redisGateway.setupRedisSubscribers();
  };

  createUser = async (req: CreateUserRequest, res: Response) => {
    try {
      validateCreateUser(req);

      // hash password first because it takes longer
      const hashedPassword = await bcrypt.hash(
        req.password,
        CONSTANTS.SALT_ROUNDS
      );

      const { email, managerUuid, userRole } = req;

      // check to see if this user exists
      const existingUser = await this.authController.getUserByUuid(email);
      if (existingUser) throw new Error("User already exists");

      const newUser: User = {
        hashedPassword,
        managerUuid,
        email,
        userRole,
      };
      const savedUser = await this.authController.createUser(newUser);
      delete savedUser.hashedPassword;

      res.send(savedUser);
    } catch (e) {
      console.log(e);
      res.status(501).send(e);
    }
  };

  loginUser = async (req: LoginUserRequest, res: Response) => {
    try {
      validateLoginUser(req);
      const { password, email } = req;

      const existingUser = await this.authController.getUserByUuid(email);
      if (!existingUser) throw new Error("Invalid email/password combination");

      const isMatch = await bcrypt.compare(
        password,
        existingUser.hashedPassword
      );
      if (!isMatch) throw new Error("Invalid email/password combination");

      delete existingUser.hashedPassword;
      const accessToken = this.generateAccessToken(existingUser);

      res.send({ accessToken });
    } catch (e) {
      console.log(e);
      res.status(501).send(e);
    }
  };

  generateAccessToken = (user: User) => {
    return jwt.sign(user, "test");
  };

  // get createdBy uuid from the header
  createTask = async (req: CreateTaskRequest, res: Response) => {
    try {
      validateCreateTask(req, CONSTANTS.MAX_WORD_LENGTH);
      const { task, userUuid } = req;
      task.createdByUuid = userUuid;
      const newTask = await this.taskController.createTask(task);

      res.send(newTask);
    } catch (e) {
      console.log(e);
      res.status(501).send(e);
    }
  };

  updateTask = async (req: UpdateTaskRequest, res: Response) => {
    try {
      validateUpdateTask(req);
      const { task } = req;
      const updatedTask = await this.taskController.updateTask(
        task,
        req.userUuid
      );

      res.send(updatedTask);
    } catch (e) {
      console.log(e);
      res.status(501).send(e);
    }
  };

  deleteTask = async (req: DeleteTaskRequest, res: Response) => {
    validateDeleteTask(req);

    const { taskUuid } = req;
    await this.taskController.deleteTask(taskUuid, req.userUuid);
    res.send({ success: true });
    try {
    } catch (e) {
      console.log(e);
      res.status(501).send(e);
    }
  };

  getTasks = async (req: GetTasksRequest, res: Response) => {
    try {
      validateGetTasks(req);

      const { userUuid } = req;
      const tasks = await this.taskController.getTasks(userUuid);
      res.send(tasks);
    } catch (e) {
      console.log(e);
      res.status(501).send(e);
    }
  };
}

export default Handler;
