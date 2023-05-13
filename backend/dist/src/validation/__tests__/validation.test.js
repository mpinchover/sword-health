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
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const __1 = require("..");
describe("Validation test suite", () => {
    //   beforeAll(() => {});
    //   afterAll(() => {});
    it("Test create a task validation", () => __awaiter(void 0, void 0, void 0, function* () {
        // expect(provider).not.to.be.null;
        //  expect(providers.length).to.equal(0);
        (0, chai_1.expect)(() => (0, __1.validateCreateTask)(null, 0)).to.throw("req cannot be null");
        // @ts-ignore
        const req = {};
        (0, chai_1.expect)(() => (0, __1.validateCreateTask)(req, 0)).to.throw("task cannot be null");
        req.task = {};
        (0, chai_1.expect)(() => (0, __1.validateCreateTask)(req, 0)).to.throw("summary cannot be null");
        req.task = {};
        (0, chai_1.expect)(() => (0, __1.validateCreateTask)(req, 0)).to.throw("summary cannot be null");
        req.task = {
            summary: "This is a summary",
        };
        (0, chai_1.expect)(() => (0, __1.validateCreateTask)(req, 3)).to.throw("summary cannot be more than 3 words");
        (0, chai_1.expect)((0, __1.validateCreateTask)(req, 10)).to.be.true;
    }));
    it("Test update a task validation", () => __awaiter(void 0, void 0, void 0, function* () {
        (0, chai_1.expect)(() => (0, __1.validateUpdateTask)(null)).to.throw("req cannot be null");
        // @ts-ignore
        const req = {};
        (0, chai_1.expect)(() => (0, __1.validateUpdateTask)(req)).to.throw("task cannot be null");
        req.task = {};
        (0, chai_1.expect)(() => (0, __1.validateUpdateTask)(req)).to.throw("task uuid cannot be null");
        req.task.uuid = "uuid";
        (0, chai_1.expect)((0, __1.validateUpdateTask)(req)).to.be.true;
    }));
    it("Test delete a task validation", () => __awaiter(void 0, void 0, void 0, function* () {
        (0, chai_1.expect)(() => (0, __1.validateUpdateTask)(null)).to.throw("req cannot be null");
        // @ts-ignore
        const req = {};
        (0, chai_1.expect)(() => (0, __1.validateDeleteTask)(req)).to.throw("task uuid cannot be null");
        req.taskUuid = "uuid";
        (0, chai_1.expect)((0, __1.validateDeleteTask)(req)).to.be.true;
    }));
    it("Test update a task validation", () => __awaiter(void 0, void 0, void 0, function* () {
        (0, chai_1.expect)(() => (0, __1.validateUpdateTask)(null)).to.throw("req cannot be null");
        // @ts-ignore
        const req = {};
        (0, chai_1.expect)(() => (0, __1.validateUpdateTask)(req)).to.throw("task cannot be null");
        req.task = {};
        (0, chai_1.expect)(() => (0, __1.validateUpdateTask)(req)).to.throw("task uuid cannot be null");
        req.task.uuid = "uuid";
        (0, chai_1.expect)((0, __1.validateUpdateTask)(req)).to.be.true;
    }));
    it("Test create a user validation", () => __awaiter(void 0, void 0, void 0, function* () {
        (0, chai_1.expect)(() => (0, __1.validateCreateUser)(null)).to.throw("req cannot be null");
        // @ts-ignore
        const req = {};
        (0, chai_1.expect)(() => (0, __1.validateCreateUser)(req)).to.throw("email cannot be null");
        req.email = "email";
        (0, chai_1.expect)(() => (0, __1.validateCreateUser)(req)).to.throw("password cannot be null");
        req.password = "password";
        (0, chai_1.expect)(() => (0, __1.validateCreateUser)(req)).to.throw("confirm password cannot be null");
        req.confirmPassword = "confirm-password";
        (0, chai_1.expect)(() => (0, __1.validateCreateUser)(req)).to.throw("password does not match confirm password");
        req.confirmPassword = "password";
        (0, chai_1.expect)((0, __1.validateCreateUser)(req)).to.be.true;
    }));
    it("Test login a user validation", () => __awaiter(void 0, void 0, void 0, function* () {
        (0, chai_1.expect)(() => (0, __1.validateLoginUser)(null)).to.throw("req cannot be null");
        // @ts-ignore
        const req = {};
        (0, chai_1.expect)(() => (0, __1.validateLoginUser)(req)).to.throw("email cannot be null");
        req.email = "email";
        (0, chai_1.expect)(() => (0, __1.validateLoginUser)(req)).to.throw("password cannot be null");
        req.password = "password";
        (0, chai_1.expect)((0, __1.validateLoginUser)(req)).to.be.true;
    }));
    it("Test get tasks validation", () => __awaiter(void 0, void 0, void 0, function* () {
        (0, chai_1.expect)(() => (0, __1.validateGetTasks)(null)).to.throw("req cannot be null");
        // @ts-ignore
        const req = {};
        (0, chai_1.expect)(() => (0, __1.validateGetTasks)(req)).to.throw("user uuid cannot be null");
        req.userUuid = "uuid";
        (0, chai_1.expect)((0, __1.validateGetTasks)(req)).to.be.true;
    }));
});
