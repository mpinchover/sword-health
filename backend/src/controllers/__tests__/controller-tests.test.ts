import { expect, use } from "chai";
// import { jest } from "@jest/globals";
import { Task, User } from "../../types";
import AuthController from "../auth-controller";
import * as sinon from "sinon";
use(require("chai-as-promised"));

import TaskController from "../task-controller";
describe("controller test suite", () => {
  it("Test create a user", async () => {
    // expect(provider).not.to.be.null;
    //  expect(providers.length).to.equal(0);

    const authController = new AuthController();

    const newUser: User = {
      // createdAtUTC: new Date(),
      // uuid: "some-uuid",
      managerUuid: "manager-uuid",
    };

    const repo = {
      createUser: sinon.fake((repoUser) => {
        return repoUser;
      }),
    };

    // @ts-ignore
    authController.repo = repo;

    const res: User = await authController.createUser(newUser);
    expect(res.createdAtUTC).to.equal(newUser.createdAtUTC);
    expect(res.uuid).to.equal(newUser.uuid);
    expect(res.managerUuid).to.equal(newUser.managerUuid);
  });

  it("Test update a task, task not found", async () => {
    const taskController = new TaskController();
    const task: Task = {};

    const repo = {
      getTaskByUuid: sinon.fake(() => null),
    };

    // @ts-ignore
    taskController.repo = repo;

    await expect(
      taskController.updateTask(task, "some-uuid")
    ).to.be.rejectedWith("Task does not exist");
  });

  it("Test update a task, unauthorized", async () => {
    const taskController = new TaskController();
    const task: Task = {
      createdByUuid: "uuid-1",
    };

    const repo = {
      getTaskByUuid: sinon.fake(() => task),
    };

    // @ts-ignore
    taskController.repo = repo;

    await expect(taskController.updateTask(task, "uuid-2")).to.be.rejectedWith(
      "Unauthorized to update this task"
    );
  });

  it("Test update a task", async () => {
    const taskController = new TaskController();
    const previousTime = new Date("2010-08-01");
    const task: Task = {
      createdByUuid: "uuid-1",
      updatedAtUTC: previousTime,
    };

    const repo = {
      getTaskByUuid: sinon.fake(() => {
        return task;
      }),
      updateTask: sinon.fake((task) => task),
    };

    // @ts-ignore
    taskController.repo = repo;
    const res = await taskController.updateTask(task, "uuid-1");
    expect(res.updatedAtUTC > previousTime).to.be.true;
  });

  // it("Test delete a task with task not found", async () => {
  //   const taskController = new TaskController();

  //   const task: Task = {
  //     uuid: "uuid",
  //   };

  //   let repo = {
  //     getTaskByUuid: sinon.fake(() => {}),
  //   };

  //   // @ts-ignore
  //   taskController.repo = repo;

  //   const res = await taskController.deleteTask("uuid", "user-uuid");
  //   expect(res.updatedAtUTC > previousTime).to.be.true;
  // });
});
