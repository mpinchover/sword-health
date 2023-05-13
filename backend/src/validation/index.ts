import {
  Task,
  UpdateActions,
  CreateTaskRequest,
  DeleteTaskRequest,
  GetTasksRequest,
  UpdateTaskRequest,
  CreateUserRequest,
  LoginUserRequest,
} from "../types";
import express, { Express, Request, Response } from "express";

export const validateCreateTask = (
  req: CreateTaskRequest,
  maxWordLength: number
) => {
  if (!req) throw new Error("req cannot be null");
  if (!req.task) throw new Error("task cannot be null");
  if (!req.task.summary) throw new Error("summary cannot be null");

  if (req.task.summary.split(" ").length > maxWordLength)
    throw new Error(`summary cannot be more than ${maxWordLength} words`);

  return true;
};

export const validateDeleteTask = (req: DeleteTaskRequest) => {
  if (!req) throw new Error("req cannot be null");
  if (!req.taskUuid) throw new Error("task uuid cannot be null");

  return true;
};

// check for a uuid and then the update type
// check that the type is in the enum
export const validateUpdateTask = (req: UpdateTaskRequest) => {
  if (!req) throw new Error("req cannot be null");
  if (!req.task) throw new Error("task cannot be null");
  if (!req.task.uuid) throw new Error("task uuid cannot be null");

  return true;
};

export const validateCreateUser = (req: CreateUserRequest) => {
  if (!req) throw new Error("req cannot be null");
  if (!req.email) throw new Error("email cannot be null");
  if (!req.password) throw new Error("password cannot be null");
  if (!req.confirmPassword) throw new Error("confirm password cannot be null");
  if (req.password !== req.confirmPassword)
    throw new Error("password does not match confirm password");

  return true;
};

export const validateLoginUser = (req: LoginUserRequest) => {
  if (!req) throw new Error("req cannot be null");
  if (!req.email) throw new Error("email cannot be null");
  if (!req.password) throw new Error("password cannot be null");

  return true;
};
export const validateGetTasks = (req: GetTasksRequest) => {
  if (!req) throw new Error("req cannot be null");
  if (!req.userUuid) throw new Error("user uuid cannot be null");

  return true;
};
