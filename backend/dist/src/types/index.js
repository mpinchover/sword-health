"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateActions = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole[UserRole["MANAGER"] = 0] = "MANAGER";
    UserRole[UserRole["TECHNICIAN"] = 1] = "TECHNICIAN";
})(UserRole = exports.UserRole || (exports.UserRole = {}));
var UpdateActions;
(function (UpdateActions) {
    UpdateActions[UpdateActions["UPDATE_DESCRIPTION"] = 1] = "UPDATE_DESCRIPTION";
    UpdateActions[UpdateActions["UPDATE_DATE_PERFORMED"] = 2] = "UPDATE_DATE_PERFORMED";
})(UpdateActions = exports.UpdateActions || (exports.UpdateActions = {}));
