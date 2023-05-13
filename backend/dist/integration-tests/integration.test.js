"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const axios_1 = __importDefault(require("axios"));
(0, chai_1.use)(require("chai-as-promised"));
describe("Create a technician, create a task, update the task, read the task, delete the task", () => {
    it("Testing create a techician, create a task", () => __awaiter(void 0, void 0, void 0, function* () {
        // @ts-ignore
        const createUserRequest = {
            email: "test-user-email",
            password: "test-user-password",
            confirmPassword: "test-user-password",
            userRole: "TECHNICIAN",
        };
        let url = "http://127.0.0.1:5001/create-user";
        let res = yield axios_1.default.post(url, createUserRequest);
        // console.log(res.data);
        // @ts-ignore
        const loginUserRequest = {
            email: "test-user-email",
            password: "test-user-password",
        };
        url = "http://127.0.0.1:5001/login-user";
        res = yield axios_1.default.post(url, loginUserRequest);
        // console.log(res.data);
        const headers = {
            //   "Content-Type": "application/json",
            Authorization: `bearer ${res.data.accessToken}`,
        };
        const newTask = {
            summary: "This is my new task",
            taskStatus: "OPEN",
        };
        // @ts-ignore
        const createTaskRequest = {
            task: newTask,
        };
        url = "http://127.0.0.1:5001/create-task";
        res = yield axios_1.default.post(url, createTaskRequest, { headers });
        // console.log(res.data);
        const createdTaskUuid = res.data.uuid;
        const updatedTask = res.data;
        updatedTask.summary = "This is my updated task";
        updatedTask.taskStatus = "CLOSED";
        updatedTask.datePerformed = new Date();
        // @ts-ignore
        const updateTaskRequest = {
            task: updatedTask,
        };
        url = "http://127.0.0.1:5001/update-task";
        res = yield axios_1.default.post(url, updateTaskRequest, { headers });
        // console.log(res.data);
        url = "http://127.0.0.1:5001/get-tasks";
        res = yield axios_1.default.get(url, { headers });
        // console.log(res.data);
        (0, chai_1.expect)(res.data.length).to.equal(1);
        // @ts-ignore
        const deleteTaskRequest = {
            taskUuid: createdTaskUuid,
        };
        url = "http://127.0.0.1:5001/delete-task";
        res = yield axios_1.default.post(url, deleteTaskRequest, { headers });
        url = "http://127.0.0.1:5001/get-tasks";
        res = yield axios_1.default.get(url, { headers });
        (0, chai_1.expect)(res.data.length).to.equal(0);
        // expect(1 + 1 === 2).to.be.true;
    }));
    it("Create 2 technicians and a manager to test read access and delete access", () => __awaiter(void 0, void 0, void 0, function* () {
        const manager1Email = "manager-email";
        const manager1Password = "manager-password";
        const tech1Email = "tech-1-email-unique";
        const tech1Password = "tech-1-password-unique";
        const tech2Email = "tech-2-email-unique";
        const tech2Password = "tech-2-password-unique";
        // @ts-ignore
        const createManager1Request = {
            email: manager1Email,
            password: manager1Password,
            confirmPassword: manager1Password,
            userRole: "MANAGER",
        };
        let url = "http://127.0.0.1:5001/create-user";
        let res = yield axios_1.default.post(url, createManager1Request);
        const manager1Uuid = res.data.uuid;
        (0, chai_1.expect)(manager1Uuid).to.not.be.undefined;
        // @ts-ignore
        const createUser1Request = {
            email: tech1Email,
            password: tech1Password,
            confirmPassword: tech1Password,
            managerUuid: manager1Uuid,
            userRole: "TECHNICIAN",
        };
        // @ts-ignore
        const createUser2Request = {
            email: tech2Email,
            password: tech2Password,
            confirmPassword: tech2Password,
            userRole: "TECHNICIAN",
        };
        url = "http://127.0.0.1:5001/create-user";
        res = yield axios_1.default.post(url, createUser1Request);
        const createdUser1 = res.data;
        res = yield axios_1.default.post(url, createUser2Request);
        const createdUser2 = res.data;
        // @ts-ignore
        const loginManager1Request = {
            email: manager1Email,
            password: manager1Password,
        };
        url = "http://127.0.0.1:5001/login-user";
        res = yield axios_1.default.post(url, loginManager1Request);
        const headersManager1 = {
            //   "Content-Type": "application/json",
            Authorization: `bearer ${res.data.accessToken}`,
        };
        // @ts-ignore
        const loginUser1Request = {
            email: tech1Email,
            password: tech1Password,
        };
        url = "http://127.0.0.1:5001/login-user";
        const loginRes1 = yield axios_1.default.post(url, loginUser1Request);
        // console.log(res.data);
        const headersUser1 = {
            //   "Content-Type": "application/json",
            Authorization: `bearer ${loginRes1.data.accessToken}`,
        };
        // @ts-ignore
        const loginUser2Request = {
            email: tech2Email,
            password: tech2Password,
        };
        url = "http://127.0.0.1:5001/login-user";
        const loginRes2 = yield axios_1.default.post(url, loginUser2Request);
        // console.log(res.data);
        const headersUser2 = {
            //   "Content-Type": "application/json",
            Authorization: `bearer ${loginRes2.data.accessToken}`,
        };
        const user1Task = {
            summary: "User 1 task",
            taskStatus: "OPEN",
        };
        const user2Task = {
            summary: "User 2 task",
            taskStatus: "OPEN",
        };
        // @ts-ignore
        const createTaskUser1Request = {
            task: user1Task,
        };
        url = "http://127.0.0.1:5001/create-task";
        res = yield axios_1.default.post(url, createTaskUser1Request, {
            headers: headersUser1,
        });
        const user1CreatedTask = res.data;
        // @ts-ignore
        const createTaskUser2Request = {
            task: user2Task,
        };
        url = "http://127.0.0.1:5001/create-task";
        res = yield axios_1.default.post(url, createTaskUser2Request, {
            headers: headersUser2,
        });
        const user2CreatedTask = res.data;
        // now query tech 1 tasks and make sure that it's just one item being returned
        url = "http://127.0.0.1:5001/get-tasks";
        res = yield axios_1.default.get(url, { headers: headersUser1 });
        // console.log(res.data);
        (0, chai_1.expect)(res.data.length).to.equal(1);
        url = "http://127.0.0.1:5001/get-tasks";
        res = yield axios_1.default.get(url, { headers: headersUser2 });
        // console.log(res.data);
        (0, chai_1.expect)(res.data.length).to.equal(1);
        // make sure tech 1 cannot update tech 2's task
        // this should fail
        // @ts-ignore
        const updateTaskRequest = {
            task: user2CreatedTask,
        };
        url = "http://127.0.0.1:5001/update-task";
        yield (0, chai_1.expect)(axios_1.default.post(url, updateTaskRequest, { headers: headersUser1 }))
            .to.be.rejected;
        url = "http://127.0.0.1:5001/get-tasks";
        res = yield axios_1.default.get(url, { headers: headersManager1 });
        // console.log(res.data);
        (0, chai_1.expect)(res.data.length).to.equal(1);
        // @ts-ignore
        let deleteTaskRequest = {
            taskUuid: user1CreatedTask.uuid,
        };
        url = "http://127.0.0.1:5001/delete-task";
        yield (0, chai_1.expect)(axios_1.default.post(url, deleteTaskRequest, { headers: headersManager1 })).to.not.be.rejected;
        url = "http://127.0.0.1:5001/get-tasks";
        res = yield axios_1.default.get(url, { headers: headersManager1 });
        // console.log(res.data);
        (0, chai_1.expect)(res.data.length).to.equal(0);
        // @ts-ignore
        const invalidDeleteTaskRequest = {
            taskUuid: user2CreatedTask.uuid,
        };
        // should fail to delete tech 2's task
        axios_1.default.post(url, invalidDeleteTaskRequest, { headers: headersManager1 });
        url = "http://127.0.0.1:5001/get-tasks";
        res = yield axios_1.default.get(url, { headers: headersUser2 });
        // console.log(res.data);
        (0, chai_1.expect)(res.data.length).to.equal(1);
    }));
});
