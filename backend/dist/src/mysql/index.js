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
Object.defineProperty(exports, "__esModule", { value: true });
const mysql2 = __importStar(require("mysql2/promise"));
class MySQL {
    static closeConn() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.mysqlDB) {
                yield this.mysqlDB.end();
            }
        });
    }
    static getDb() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.mysqlDB) {
                return this.mysqlDB;
            }
            let host, user, password, database, port;
            host = process.env.TASK_MANAGER_SQL_HOST;
            user = process.env.TASK_MANAGER_USER;
            password = process.env.TASK_MANAGER_PASSWORD;
            database = process.env.TASK_MANAGER_DATABASE;
            port = parseInt(process.env.TASK_MANAGER_SQL_PORT);
            const connection = yield mysql2.createConnection({
                host,
                user,
                password,
                database,
                port,
            });
            this.mysqlDB = connection;
            return connection;
        });
    }
}
exports.default = MySQL;
