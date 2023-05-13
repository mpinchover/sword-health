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
const express_1 = __importDefault(require("express"));
const handlers_1 = __importDefault(require("./src/handlers"));
const middleware_1 = require("./src/middleware");
const cors = require("cors")({ origin: true });
// import * as express from "express";
const app = (0, express_1.default)();
const port = 5001;
app.use(cors);
app.use(express_1.default.json());
const h = new handlers_1.default();
// set up redis
// can just create an async fn here too
const setupSubscribers = () => __awaiter(void 0, void 0, void 0, function* () {
    yield h.setupRedisSubscribers();
});
setupSubscribers();
// @ts-ignore
app.get("/test", h.test);
// @ts-ignore
app.get("/test2", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.send({ msg: process.env.TASK_MANAGER_SQL_HOST });
    }
    catch (e) {
        res.status(501).send(e);
    }
}));
// @ts-ignore
app.post("/create-task", middleware_1.setBodyData, middleware_1.authenticateToken, h.createTask);
// @ts-ignore
app.post("/update-task", middleware_1.setBodyData, middleware_1.authenticateToken, h.updateTask);
// @ts-ignore
app.post("/delete-task", middleware_1.setBodyData, middleware_1.authenticateToken, h.deleteTask);
// @ts-ignore
app.get("/get-tasks", middleware_1.authenticateToken, h.getTasks);
// @ts-ignore
app.post("/create-user", middleware_1.setBodyData, h.createUser);
// @ts-ignore
app.post("/login-user", middleware_1.setBodyData, h.loginUser);
app.listen(process.env.APP_PORT, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${process.env.APP_PORT}`);
});
