"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const auth_controller_1 = __importDefault(require("../auth-controller"));
const sinon = __importStar(require("sinon"));
(0, chai_1.use)(require("chai-as-promised"));
const task_controller_1 = __importDefault(require("../task-controller"));
describe("controller test suite", () => {
    it("Test create a user", () => __awaiter(void 0, void 0, void 0, function* () {
        // expect(provider).not.to.be.null;
        //  expect(providers.length).to.equal(0);
        const authController = new auth_controller_1.default();
        const newUser = {
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
        const res = yield authController.createUser(newUser);
        (0, chai_1.expect)(res.createdAtUTC).to.equal(newUser.createdAtUTC);
        (0, chai_1.expect)(res.uuid).to.equal(newUser.uuid);
        (0, chai_1.expect)(res.managerUuid).to.equal(newUser.managerUuid);
    }));
    it("Test update a task, task not found", () => __awaiter(void 0, void 0, void 0, function* () {
        const taskController = new task_controller_1.default();
        const task = {};
        const repo = {
            getTaskByUuid: sinon.fake(() => null),
        };
        // @ts-ignore
        taskController.repo = repo;
        yield (0, chai_1.expect)(taskController.updateTask(task, "some-uuid")).to.be.rejectedWith("Task does not exist");
    }));
    it("Test update a task, unauthorized", () => __awaiter(void 0, void 0, void 0, function* () {
        const taskController = new task_controller_1.default();
        const task = {
            createdByUuid: "uuid-1",
        };
        const repo = {
            getTaskByUuid: sinon.fake(() => task),
        };
        // @ts-ignore
        taskController.repo = repo;
        yield (0, chai_1.expect)(taskController.updateTask(task, "uuid-2")).to.be.rejectedWith("Unauthorized to update this task");
    }));
    it("Test update a task", () => __awaiter(void 0, void 0, void 0, function* () {
        const taskController = new task_controller_1.default();
        const previousTime = new Date("2010-08-01");
        const task = {
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
        const res = yield taskController.updateTask(task, "uuid-1");
        (0, chai_1.expect)(res.updatedAtUTC > previousTime).to.be.true;
    }));
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
