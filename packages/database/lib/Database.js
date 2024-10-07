"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const post_1 = require("./post");
const post_queue_1 = require("./post-queue");
class Database {
    constructor(uri) {
        this.connection = mongoose_1.default.createConnection(uri);
        this.connection.set('strictQuery', true);
        this.post = new post_1.PostCollection(this.connection);
        this.postQueue = new post_queue_1.PostQueueCollection(this.connection);
    }
}
exports.Database = Database;
//# sourceMappingURL=Database.js.map