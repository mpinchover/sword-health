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
const validation_1 = require("../validation");
const task_controller_1 = __importDefault(require("../controllers/task-controller"));
const auth_controller_1 = __importDefault(require("../controllers/auth-controller"));
const CONSTANTS = __importStar(require("../utils/constants"));
const bcrypt = __importStar(require("bcrypt"));
const jwt = __importStar(require("jsonwebtoken"));
const redis_1 = __importDefault(require("../gateway/redis"));
// TODO
// use TSrynge
class Handler {
    constructor() {
        this.setupRedisSubscribers = () => __awaiter(this, void 0, void 0, function* () {
            yield this.redisGateway.setupRedisSubscribers();
        });
        this.test = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.redisGateway.publish(CONSTANTS.NOTIFICATION_CHANNEL, "THIS IS A NOTIFICATION");
                res.send("success");
            }
            catch (e) {
                console.log(e);
            }
        });
        // check to see if the user already exists by email
        this.createUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                (0, validation_1.validateCreateUser)(req);
                // hash password first because it takes longer
                const hashedPassword = yield bcrypt.hash(req.password, CONSTANTS.SALT_ROUNDS);
                const { email, managerUuid, userRole } = req;
                // check to see if this user exists
                const existingUser = yield this.authController.getUserByUuid(email);
                if (existingUser)
                    throw new Error("User already exists");
                const newUser = {
                    hashedPassword,
                    managerUuid,
                    email,
                    userRole,
                };
                const savedUser = yield this.authController.createUser(newUser);
                delete savedUser.hashedPassword;
                res.send(savedUser);
            }
            catch (e) {
                console.log(e);
                res.status(501).send(e);
            }
        });
        this.loginUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                (0, validation_1.validateLoginUser)(req);
                const { password, email } = req;
                const existingUser = yield this.authController.getUserByUuid(email);
                if (!existingUser)
                    throw new Error("Invalid email/password combination");
                const isMatch = yield bcrypt.compare(password, existingUser.hashedPassword);
                if (!isMatch)
                    throw new Error("Invalid email/password combination");
                delete existingUser.hashedPassword;
                const accessToken = this.generateAccessToken(existingUser);
                res.send({ accessToken });
            }
            catch (e) {
                console.log(e);
                res.status(501).send(e);
            }
        });
        // TODO – add in expiration for token
        this.generateAccessToken = (user) => {
            return jwt.sign(user, "test");
        };
        // get createdBy uuid from the header
        // at this point we should have the user uuid in the req
        // add in params
        // maybe do some error mapping here as well
        this.createTask = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                (0, validation_1.validateCreateTask)(req, CONSTANTS.MAX_WORD_LENGTH);
                const { task, userUuid } = req;
                task.createdByUuid = userUuid;
                const newTask = yield this.taskController.createTask(task);
                res.send(newTask);
            }
            catch (e) {
                console.log(e);
                res.status(501).send(e);
            }
        });
        // TODO make sure only the technicians whos task it is can update the task
        this.updateTask = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                (0, validation_1.validateUpdateTask)(req);
                const { task } = req;
                const updatedTask = yield this.taskController.updateTask(task, req.userUuid);
                res.send(updatedTask);
            }
            catch (e) {
                console.log(e);
                res.status(501).send(e);
            }
        });
        this.deleteTask = (req, res) => __awaiter(this, void 0, void 0, function* () {
            (0, validation_1.validateDeleteTask)(req);
            const { taskUuid } = req;
            yield this.taskController.deleteTask(taskUuid, req.userUuid);
            res.send({ success: true });
            try {
            }
            catch (e) {
                console.log(e);
                res.status(501).send(e);
            }
        });
        // TODO's
        // add a filter option to get tasks by uuid
        // include pagination
        this.getTasks = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                (0, validation_1.validateGetTasks)(req);
                const { userUuid } = req;
                const tasks = yield this.taskController.getTasks(userUuid);
                res.send(tasks);
            }
            catch (e) {
                console.log(e);
                res.status(501).send(e);
            }
        });
        this.taskController = new task_controller_1.default();
        this.authController = new auth_controller_1.default();
        this.redisGateway = new redis_1.default();
    }
}
exports.default = Handler;
