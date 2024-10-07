"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostQueue = exports.PostQueueSeriesMetadata = exports.PostQueueAltMetadata = exports.PostQueueStep = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const gallery_enums_1 = require("@zougui/gallery.enums");
class PostQueueStep {
}
exports.PostQueueStep = PostQueueStep;
__decorate([
    (0, typegoose_1.prop)({ enum: gallery_enums_1.PostQueueStatus, type: String, required: true }),
    __metadata("design:type", String)
], PostQueueStep.prototype, "status", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, required: false }),
    __metadata("design:type", String)
], PostQueueStep.prototype, "message", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: [String], required: false }),
    __metadata("design:type", Array)
], PostQueueStep.prototype, "errorList", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Date, required: true }),
    __metadata("design:type", Date)
], PostQueueStep.prototype, "date", void 0);
class PostQueueAltMetadata {
}
exports.PostQueueAltMetadata = PostQueueAltMetadata;
__decorate([
    (0, typegoose_1.prop)({ required: true, index: true }),
    __metadata("design:type", String)
], PostQueueAltMetadata.prototype, "id", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], PostQueueAltMetadata.prototype, "label", void 0);
class PostQueueSeriesMetadata {
}
exports.PostQueueSeriesMetadata = PostQueueSeriesMetadata;
__decorate([
    (0, typegoose_1.prop)({ required: true, index: true }),
    __metadata("design:type", String)
], PostQueueSeriesMetadata.prototype, "id", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, enum: gallery_enums_1.PostSeriesType, required: true }),
    __metadata("design:type", String)
], PostQueueSeriesMetadata.prototype, "type", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], PostQueueSeriesMetadata.prototype, "name", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, required: false }),
    __metadata("design:type", String)
], PostQueueSeriesMetadata.prototype, "chapterName", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", Number)
], PostQueueSeriesMetadata.prototype, "chapterIndex", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", Number)
], PostQueueSeriesMetadata.prototype, "partIndex", void 0);
class PostQueue {
}
exports.PostQueue = PostQueue;
__decorate([
    (0, typegoose_1.prop)({ type: PostQueueAltMetadata, required: false, _id: false }),
    __metadata("design:type", PostQueueAltMetadata)
], PostQueue.prototype, "alt", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: PostQueueSeriesMetadata, required: false, _id: false }),
    __metadata("design:type", PostQueueSeriesMetadata)
], PostQueue.prototype, "series", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: [PostQueueStep], required: true, _id: false }),
    __metadata("design:type", Array)
], PostQueue.prototype, "steps", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, required: false }),
    __metadata("design:type", String)
], PostQueue.prototype, "fileName", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, required: true, index: true, unique: true }),
    __metadata("design:type", String)
], PostQueue.prototype, "url", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, required: false }),
    __metadata("design:type", String)
], PostQueue.prototype, "attachmentUrl", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, required: false }),
    __metadata("design:type", String)
], PostQueue.prototype, "title", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: [String], required: false }),
    __metadata("design:type", Array)
], PostQueue.prototype, "keywords", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, required: false }),
    __metadata("design:type", String)
], PostQueue.prototype, "description", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Date, required: true }),
    __metadata("design:type", Date)
], PostQueue.prototype, "createdAt", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Date, required: false }),
    __metadata("design:type", Date)
], PostQueue.prototype, "deletedAt", void 0);
//# sourceMappingURL=post-queue.model.js.map