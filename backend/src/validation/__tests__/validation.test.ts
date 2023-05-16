import { expect } from "chai";
import {
  validateCreateTask,
  validateCreateUser,
  validateDeleteTask,
  validateGetTasks,
  validateLoginUser,
  validateUpdateTask,
} from "..";
import {
  CreateTaskRequest,
  CreateUserRequest,
  DeleteTaskRequest,
  GetTasksRequest,
  LoginUserRequest,
  UpdateTaskRequest,
} from "../../types";

describe("Validation test suite", () => {


  it("Test create a task validation", async () => {
    expect(() => validateCreateTask(null, 0)).to.throw("req cannot be null");

    // @ts-ignore
    const req: CreateTaskRequest = {};
    expect(() => validateCreateTask(req, 0)).to.throw("task cannot be null");

    req.task = {};
    expect(() => validateCreateTask(req, 0)).to.throw("summary cannot be null");

    req.task = {};
    expect(() => validateCreateTask(req, 0)).to.throw("summary cannot be null");

    req.task = {
      summary: "This is a summary",
    };
    expect(() => validateCreateTask(req, 3)).to.throw(
      "summary cannot be more than 3 words"
    );

    expect(validateCreateTask(req, 10)).to.be.true;
  });

  it("Test update a task validation", async () => {
    expect(() => validateUpdateTask(null)).to.throw("req cannot be null");

    // @ts-ignore
    const req: UpdateTaskRequest = {};
    expect(() => validateUpdateTask(req)).to.throw("task cannot be null");

    req.task = {};
    expect(() => validateUpdateTask(req)).to.throw("task uuid cannot be null");

    req.task.uuid = "uuid";
    expect(validateUpdateTask(req)).to.be.true;
  });

  it("Test delete a task validation", async () => {
    expect(() => validateUpdateTask(null)).to.throw("req cannot be null");

    // @ts-ignore
    const req: DeleteTaskRequest = {};
    expect(() => validateDeleteTask(req)).to.throw("task uuid cannot be null");

    req.taskUuid = "uuid";
    expect(validateDeleteTask(req)).to.be.true;
  });

  it("Test update a task validation", async () => {
    expect(() => validateUpdateTask(null)).to.throw("req cannot be null");

    // @ts-ignore
    const req: UpdateTaskRequest = {};
    expect(() => validateUpdateTask(req)).to.throw("task cannot be null");

    req.task = {};
    expect(() => validateUpdateTask(req)).to.throw("task uuid cannot be null");

    req.task.uuid = "uuid";
    expect(validateUpdateTask(req)).to.be.true;
  });

  it("Test create a user validation", async () => {
    expect(() => validateCreateUser(null)).to.throw("req cannot be null");

    // @ts-ignore
    const req: CreateUserRequest = {};
    expect(() => validateCreateUser(req)).to.throw("email cannot be null");

    req.email = "email";
    expect(() => validateCreateUser(req)).to.throw("password cannot be null");

    req.password = "password";
    expect(() => validateCreateUser(req)).to.throw(
      "confirm password cannot be null"
    );

    req.confirmPassword = "confirm-password";
    expect(() => validateCreateUser(req)).to.throw(
      "password does not match confirm password"
    );

    req.confirmPassword = "password";
    expect(validateCreateUser(req)).to.be.true;
  });

  it("Test login a user validation", async () => {
    expect(() => validateLoginUser(null)).to.throw("req cannot be null");

    // @ts-ignore
    const req: LoginUserRequest = {};
    expect(() => validateLoginUser(req)).to.throw("email cannot be null");

    req.email = "email";
    expect(() => validateLoginUser(req)).to.throw("password cannot be null");

    req.password = "password";
    expect(validateLoginUser(req)).to.be.true;
  });

  it("Test get tasks validation", async () => {
    expect(() => validateGetTasks(null)).to.throw("req cannot be null");

    // @ts-ignore
    const req: GetTasksRequest = {};
    expect(() => validateGetTasks(req)).to.throw("user uuid cannot be null");

    req.userUuid = "uuid";
    expect(validateGetTasks(req)).to.be.true;
  });
});
