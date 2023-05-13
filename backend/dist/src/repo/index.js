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
const mysql_1 = __importDefault(require("../mysql"));
const CONSTANTS = __importStar(require("../utils/constants"));
class Repo {
    constructor() {
        this.createTask = (task) => __awaiter(this, void 0, void 0, function* () {
            const conn = yield mysql_1.default.getDb();
            const query = `insert into ${CONSTANTS.TASKS_TABLE} set ?`;
            const params = [task];
            yield conn.query(query, params);
            return task;
        });
        // query the original task and update the different fields
        this.updateTask = (task) => __awaiter(this, void 0, void 0, function* () {
            console.log("TASK IS");
            console.log(task);
            const conn = yield mysql_1.default.getDb();
            const query = `update ${CONSTANTS.TASKS_TABLE} set ? where uuid = ?`;
            const params = [task, task.uuid];
            yield conn.query(query, params);
            return task;
        });
        this.deleteTask = (task) => __awaiter(this, void 0, void 0, function* () {
            const conn = yield mysql_1.default.getDb();
            const query = `update ${CONSTANTS.TASKS_TABLE} set deletedAtUTC = ? where uuid = ?`;
            const params = [task.deletedAtUTC, task.uuid];
            yield conn.query(query, params);
        });
        this.getTaskByUuid = (uuid) => __awaiter(this, void 0, void 0, function* () {
            const conn = yield mysql_1.default.getDb();
            const query = `select * from ${CONSTANTS.TASKS_TABLE} where uuid = ?`;
            const params = [uuid];
            const [rows] = yield conn.query(query, params);
            if ((rows === null || rows === void 0 ? void 0 : rows.length) === 0)
                return null;
            return rows[0];
        });
        this.getUser = (uuid) => __awaiter(this, void 0, void 0, function* () {
            const conn = yield mysql_1.default.getDb();
            const query = `
    select * from ${CONSTANTS.USERS_TABLE} 
    where uuid = ? `;
            const params = [uuid];
            const [rows] = yield conn.query(query, params);
            if (rows.length === 0)
                return null;
            return rows[0];
        });
        this.getTechniciansOfManager = (managerUuid) => __awaiter(this, void 0, void 0, function* () {
            const conn = yield mysql_1.default.getDb();
            const uuids = [];
            const query = `
    select uuid from ${CONSTANTS.USERS_TABLE} 
    where managerUuid = ? `;
            const params = [managerUuid];
            const [rows] = yield conn.query(query, params);
            for (const row of rows) {
                uuids.push(row.uuid);
            }
            return uuids;
        });
        // need to add a join here for the manager/technician requirement
        this.getTasks = (uuids) => __awaiter(this, void 0, void 0, function* () {
            const conn = yield mysql_1.default.getDb();
            // or just make a separate query to get everyone this manager reports to
            const tasks = [];
            const query = `select * from ${CONSTANTS.TASKS_TABLE} 
        where deletedAtUTC is null and 
        createdByUuid in (?)`;
            const params = [uuids];
            const [rows] = yield conn.query(query, params);
            for (const row of rows) {
                tasks.push(row);
            }
            return tasks;
        });
        this.createUser = (user) => __awaiter(this, void 0, void 0, function* () {
            const conn = yield mysql_1.default.getDb();
            const query = `insert into ${CONSTANTS.USERS_TABLE} set ?`;
            const params = [user];
            yield conn.query(query, params);
            return user;
        });
        this.getUserByEmail = (email) => __awaiter(this, void 0, void 0, function* () {
            const conn = yield mysql_1.default.getDb();
            const query = `select * from ${CONSTANTS.USERS_TABLE} where email = ?`;
            const params = [email];
            const [rows] = yield conn.query(query, params);
            if ((rows === null || rows === void 0 ? void 0 : rows.length) === 0)
                return null;
            return rows[0];
        });
    }
}
exports.default = Repo;
