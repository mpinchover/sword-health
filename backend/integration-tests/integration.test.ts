import { expect, use } from "chai";
import {
  CreateTaskRequest,
  CreateUserRequest,
  DeleteTaskRequest,
  LoginUserRequest,
  Task,
  UpdateTaskRequest,
} from "../src/types";
import axios from "axios";
use(require("chai-as-promised"));

describe("Create a technician, create a task, update the task, read the task, delete the task", () => {
  it("Testing create a techician, create a task", async () => {
    // @ts-ignore
    const createUserRequest: CreateUserRequest = {
      email: "test-user-email",
      password: "test-user-password",
      confirmPassword: "test-user-password",
      userRole: "TECHNICIAN",
    };

    let url = "http://127.0.0.1:5001/create-user";
    let res = await axios.post(url, createUserRequest);

    // @ts-ignore
    const loginUserRequest: LoginUserRequest = {
      email: "test-user-email",
      password: "test-user-password",
    };
    url = "http://127.0.0.1:5001/login-user";
    res = await axios.post(url, loginUserRequest);

    const headers = {
      Authorization: `bearer ${res.data.accessToken}`,
    };

    const newTask: Task = {
      summary: "This is my new task",
      taskStatus: "OPEN",
    };
    // @ts-ignore
    const createTaskRequest: CreateTaskRequest = {
      task: newTask,
    };
    url = "http://127.0.0.1:5001/create-task";
    res = await axios.post(url, createTaskRequest, { headers });

    const createdTaskUuid = res.data.uuid;

    const updatedTask: Task = res.data;
    updatedTask.summary = "This is my updated task";
    updatedTask.taskStatus = "CLOSED";
    updatedTask.datePerformed = new Date();

    // @ts-ignore
    const updateTaskRequest: UpdateTaskRequest = {
      task: updatedTask,
    };
    url = "http://127.0.0.1:5001/update-task";
    res = await axios.post(url, updateTaskRequest, { headers });

    url = "http://127.0.0.1:5001/get-tasks";
    res = await axios.get(url, { headers });
    expect(res.data.length).to.equal(1);

    // @ts-ignore
    const deleteTaskRequest: DeleteTaskRequest = {
      taskUuid: createdTaskUuid,
    };
    url = "http://127.0.0.1:5001/delete-task";
    res = await axios.post(url, deleteTaskRequest, { headers });

    url = "http://127.0.0.1:5001/get-tasks";
    res = await axios.get(url, { headers });
    expect(res.data.length).to.equal(0);
  });

  it("Create 2 technicians and a manager to test read access and delete access", async () => {
    const manager1Email = "manager-email";
    const manager1Password = "manager-password";

    const tech1Email = "tech-1-email-unique";
    const tech1Password = "tech-1-password-unique";

    const tech2Email = "tech-2-email-unique";
    const tech2Password = "tech-2-password-unique";

    // @ts-ignore
    const createManager1Request: CreateUserRequest = {
      email: manager1Email,
      password: manager1Password,
      confirmPassword: manager1Password,
      userRole: "MANAGER",
    };
    let url = "http://127.0.0.1:5001/create-user";
    let res = await axios.post(url, createManager1Request);

    const manager1Uuid = res.data.uuid;
    expect(manager1Uuid).to.not.be.undefined;

    // @ts-ignore
    const createUser1Request: CreateUserRequest = {
      email: tech1Email,
      password: tech1Password,
      confirmPassword: tech1Password,
      managerUuid: manager1Uuid,
      userRole: "TECHNICIAN",
    };

    // @ts-ignore
    const createUser2Request: CreateUserRequest = {
      email: tech2Email,
      password: tech2Password,
      confirmPassword: tech2Password,
      userRole: "TECHNICIAN",
    };

    url = "http://127.0.0.1:5001/create-user";
    res = await axios.post(url, createUser1Request);
    const createdUser1 = res.data;

    res = await axios.post(url, createUser2Request);
    const createdUser2 = res.data;

    // @ts-ignore
    const loginManager1Request: LoginUserRequest = {
      email: manager1Email,
      password: manager1Password,
    };

    url = "http://127.0.0.1:5001/login-user";
    res = await axios.post(url, loginManager1Request);
    const headersManager1 = {
      Authorization: `bearer ${res.data.accessToken}`,
    };

    // @ts-ignore
    const loginUser1Request: LoginUserRequest = {
      email: tech1Email,
      password: tech1Password,
    };

    url = "http://127.0.0.1:5001/login-user";
    const loginRes1 = await axios.post(url, loginUser1Request);

    const headersUser1 = {
      Authorization: `bearer ${loginRes1.data.accessToken}`,
    };

    // @ts-ignore
    const loginUser2Request: LoginUserRequest = {
      email: tech2Email,
      password: tech2Password,
    };

    url = "http://127.0.0.1:5001/login-user";
    const loginRes2 = await axios.post(url, loginUser2Request);
    // console.log(res.data);

    const headersUser2 = {
      Authorization: `bearer ${loginRes2.data.accessToken}`,
    };

    const user1Task: Task = {
      summary: "User 1 task",
      taskStatus: "OPEN",
    };

    const user2Task: Task = {
      summary: "User 2 task",
      taskStatus: "OPEN",
    };

    // @ts-ignore
    const createTaskUser1Request: CreateTaskRequest = {
      task: user1Task,
    };
    url = "http://127.0.0.1:5001/create-task";
    res = await axios.post(url, createTaskUser1Request, {
      headers: headersUser1,
    });

    const user1CreatedTask = res.data;

    // @ts-ignore
    const createTaskUser2Request: CreateTaskRequest = {
      task: user2Task,
    };
    url = "http://127.0.0.1:5001/create-task";
    res = await axios.post(url, createTaskUser2Request, {
      headers: headersUser2,
    });

    const user2CreatedTask = res.data;

    // now query tech 1 tasks and make sure that it's just one item being returned
    url = "http://127.0.0.1:5001/get-tasks";
    res = await axios.get(url, { headers: headersUser1 });
    expect(res.data.length).to.equal(1);

    url = "http://127.0.0.1:5001/get-tasks";
    res = await axios.get(url, { headers: headersUser2 });
    expect(res.data.length).to.equal(1);

    // make sure tech 1 cannot update tech 2's task
    // this should fail
    // @ts-ignore
    const updateTaskRequest: UpdateTaskRequest = {
      task: user2CreatedTask,
    };
    url = "http://127.0.0.1:5001/update-task";

    await expect(axios.post(url, updateTaskRequest, { headers: headersUser1 }))
      .to.be.rejected;

    url = "http://127.0.0.1:5001/get-tasks";
    res = await axios.get(url, { headers: headersManager1 });
    expect(res.data.length).to.equal(1);

    // @ts-ignore
    let deleteTaskRequest: DeleteTaskRequest = {
      taskUuid: user1CreatedTask.uuid,
    };
    url = "http://127.0.0.1:5001/delete-task";
    await expect(
      axios.post(url, deleteTaskRequest, { headers: headersManager1 })
    ).to.not.be.rejected;

    url = "http://127.0.0.1:5001/get-tasks";
    res = await axios.get(url, { headers: headersManager1 });
    expect(res.data.length).to.equal(0);

    // @ts-ignore
    const invalidDeleteTaskRequest: DeleteTaskRequest = {
      taskUuid: user2CreatedTask.uuid,
    };

    // should fail to delete tech 2's task
    axios.post(url, invalidDeleteTaskRequest, { headers: headersManager1 });

    url = "http://127.0.0.1:5001/get-tasks";
    res = await axios.get(url, { headers: headersUser2 });
    expect(res.data.length).to.equal(1);
  });
});
