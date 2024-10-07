"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const typegoose_1 = require("@typegoose/typegoose");
const getModel = (collectionName, model, options) => {
    if (process.env.NODE_ENV === 'development') {
        // make sure the model is always up to date in dev mode
        delete mongoose_1.default.models[collectionName];
    }
    return (0, typegoose_1.getModelForClass)(model, {
        existingConnection: options === null || options === void 0 ? void 0 : options.connection,
        options: Object.assign(Object.assign({}, options === null || options === void 0 ? void 0 : options.options), { customName: collectionName }),
    });
};
exports.getModel = getModel;
//# sourceMappingURL=getModel.js.map