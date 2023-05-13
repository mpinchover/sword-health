"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateGetTasks = exports.validateLoginUser = exports.validateCreateUser = exports.validateUpdateTask = exports.validateDeleteTask = exports.validateCreateTask = void 0;
const validateCreateTask = (req, maxWordLength) => {
    if (!req)
        throw new Error("req cannot be null");
    if (!req.task)
        throw new Error("task cannot be null");
    if (!req.task.summary)
        throw new Error("summary cannot be null");
    if (req.task.summary.split(" ").length > maxWordLength)
        throw new Error(`summary cannot be more than ${maxWordLength} words`);
    return true;
};
exports.validateCreateTask = validateCreateTask;
const validateDeleteTask = (req) => {
    if (!req)
        throw new Error("req cannot be null");
    if (!req.taskUuid)
        throw new Error("task uuid cannot be null");
    return true;
};
exports.validateDeleteTask = validateDeleteTask;
// check for a uuid and then the update type
// check that the type is in the enum
const validateUpdateTask = (req) => {
    if (!req)
        throw new Error("req cannot be null");
    if (!req.task)
        throw new Error("task cannot be null");
    if (!req.task.uuid)
        throw new Error("task uuid cannot be null");
    return true;
};
exports.validateUpdateTask = validateUpdateTask;
const validateCreateUser = (req) => {
    if (!req)
        throw new Error("req cannot be null");
    if (!req.email)
        throw new Error("email cannot be null");
    if (!req.password)
        throw new Error("password cannot be null");
    if (!req.confirmPassword)
        throw new Error("confirm password cannot be null");
    if (req.password !== req.confirmPassword)
        throw new Error("password does not match confirm password");
    return true;
};
exports.validateCreateUser = validateCreateUser;
const validateLoginUser = (req) => {
    if (!req)
        throw new Error("req cannot be null");
    if (!req.email)
        throw new Error("email cannot be null");
    if (!req.password)
        throw new Error("password cannot be null");
    return true;
};
exports.validateLoginUser = validateLoginUser;
const validateGetTasks = (req) => {
    if (!req)
        throw new Error("req cannot be null");
    if (!req.userUuid)
        throw new Error("user uuid cannot be null");
    return true;
};
exports.validateGetTasks = validateGetTasks;
