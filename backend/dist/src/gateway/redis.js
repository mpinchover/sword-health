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
const redis_1 = require("redis");
const CONSTANTS = __importStar(require("../utils/constants"));
class RedisGateway {
    constructor() {
        // TODO - check for closed connection too
        this.createRedisConnection = () => __awaiter(this, void 0, void 0, function* () {
            this.publisher = (0, redis_1.createClient)({ url: process.env.TASK_MANAGER_REDIS_URL });
            yield this.publisher.connect();
        });
        this.setupRedisSubscribers = () => __awaiter(this, void 0, void 0, function* () {
            this.subscriber = (0, redis_1.createClient)({ url: process.env.TASK_MANAGER_REDIS_URL });
            yield this.subscriber.connect();
            this.subscriber.subscribe(CONSTANTS.NOTIFICATION_CHANNEL, function (channel, message) {
                console.log(message, channel);
            });
        });
        this.publish = (channel, msg) => __awaiter(this, void 0, void 0, function* () {
            if (!this.publisher) {
                yield this.createRedisConnection();
            }
            console.log("CHANNEL: ", channel);
            yield this.publisher.publish(channel, msg);
        });
    }
}
exports.default = RedisGateway;
