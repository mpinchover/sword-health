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
const redis_1 = __importDefault(require("../gateway/redis"));
const repo_1 = __importDefault(require("../repo"));
const uuid = __importStar(require("uuid"));
const CONSTANTS = __importStar(require("../utils/constants"));
class TaskController {
    constructor() {
        this.createTask = (task) => {
            task.uuid = uuid.v4();
            task.createdAtUTC = new Date();
            return this.repo.createTask(task);
        };
        this.updateTask = (task, userUuid) => __awaiter(this, void 0, void 0, function* () {
            task.updatedAtUTC = new Date();
            task.createdAtUTC = new Date(task.createdAtUTC);
            if (task.datePerformed)
                task.datePerformed = new Date(task.datePerformed);
            const existingTask = yield this.repo.getTaskByUuid(task.uuid);
            if (!existingTask)
                throw new Error("Task does not exist");
            if (existingTask.createdByUuid !== userUuid)
                throw new Error("Unauthorized to update this task");
            if (existingTask.taskStatus !== "CLOSED" && task.taskStatus === "CLOSED") {
                this.redisGateway.publish(CONSTANTS.NOTIFICATION_CHANNEL, `The tech ${userUuid} performed task ${existingTask.uuid} on date ${task.datePerformed}`);
            }
            return this.repo.updateTask(task);
        });
        this.deleteTask = (uuid, userUuid) => __awaiter(this, void 0, void 0, function* () {
            // check if the task exists
            const existingTask = yield this.repo.getTaskByUuid(uuid);
            if (!existingTask)
                throw new Error("Task does not exist");
            const user = yield this.repo.getUser(userUuid);
            const uuids = new Set();
            if (user.userRole === "MANAGER") {
                const reports = yield this.repo.getTechniciansOfManager(userUuid);
                for (const str of reports)
                    uuids.add(str);
            }
            else {
                uuids.add(userUuid);
            }
            console.log("SET OF UUIDS IS");
            console.log(uuids);
            if (!uuids.has(existingTask.createdByUuid))
                throw new Error("Unauthorized to delete this task");
            // if (existingTask.createdByUuid !== userUuid)
            //   throw new Error("Unauthorized to delete this task");
            existingTask.deletedAtUTC = new Date();
            this.repo.deleteTask(existingTask);
        });
        this.getTasks = (userUuid) => __awaiter(this, void 0, void 0, function* () {
            const user = yield this.repo.getUser(userUuid);
            const uuids = [userUuid];
            // this is a manager
            if (!user.managerUuid) {
                const reports = yield this.repo.getTechniciansOfManager(userUuid);
                uuids.push(...reports);
            }
            return this.repo.getTasks(uuids);
        });
        this.repo = new repo_1.default();
        this.redisGateway = new redis_1.default();
    }
}
exports.default = TaskController;
