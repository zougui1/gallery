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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = exports.PostSimilarityMetadata = exports.PostAltMetadata = exports.PostSeriesMetadata = exports.Author = exports.PostThumbnail = exports.PostThumbnailFile = exports.PostAttachment = exports.PostFile = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const typegoose_1 = require("@typegoose/typegoose");
const gallery_enums_1 = require("@zougui/gallery.enums");
class PostFile {
}
exports.PostFile = PostFile;
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], PostFile.prototype, "fileName", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], PostFile.prototype, "contentType", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, required: false }),
    __metadata("design:type", String)
], PostFile.prototype, "hash", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, required: false, unique: true, sparse: true }),
    __metadata("design:type", String)
], PostFile.prototype, "checksum", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number, required: true }),
    __metadata("design:type", Number)
], PostFile.prototype, "size", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number, required: false }),
    __metadata("design:type", Number)
], PostFile.prototype, "width", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number, required: false }),
    __metadata("design:type", Number)
], PostFile.prototype, "height", void 0);
class PostAttachment {
}
exports.PostAttachment = PostAttachment;
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], PostAttachment.prototype, "fileName", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], PostAttachment.prototype, "contentType", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], PostAttachment.prototype, "sourceUrl", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number, required: true }),
    __metadata("design:type", Number)
], PostAttachment.prototype, "size", void 0);
class PostThumbnailFile {
}
exports.PostThumbnailFile = PostThumbnailFile;
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], PostThumbnailFile.prototype, "fileName", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], PostThumbnailFile.prototype, "contentType", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number, required: true }),
    __metadata("design:type", Number)
], PostThumbnailFile.prototype, "size", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number, required: true }),
    __metadata("design:type", Number)
], PostThumbnailFile.prototype, "width", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Number, required: true }),
    __metadata("design:type", Number)
], PostThumbnailFile.prototype, "height", void 0);
class PostThumbnail {
}
exports.PostThumbnail = PostThumbnail;
__decorate([
    (0, typegoose_1.prop)({ type: PostThumbnailFile, required: true, _id: false }),
    __metadata("design:type", String)
], PostThumbnail.prototype, "original", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: PostThumbnailFile, required: true, _id: false }),
    __metadata("design:type", String)
], PostThumbnail.prototype, "small", void 0);
class Author {
}
exports.Author = Author;
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], Author.prototype, "name", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], Author.prototype, "url", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, required: false }),
    __metadata("design:type", String)
], Author.prototype, "avatar", void 0);
class PostSeriesMetadata {
}
exports.PostSeriesMetadata = PostSeriesMetadata;
__decorate([
    (0, typegoose_1.prop)({ required: true, index: true }),
    __metadata("design:type", String)
], PostSeriesMetadata.prototype, "id", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, enum: gallery_enums_1.PostSeriesType, required: true }),
    __metadata("design:type", String)
], PostSeriesMetadata.prototype, "type", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], PostSeriesMetadata.prototype, "name", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, required: false }),
    __metadata("design:type", String)
], PostSeriesMetadata.prototype, "chapterName", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", Number)
], PostSeriesMetadata.prototype, "chapterIndex", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", Number)
], PostSeriesMetadata.prototype, "partIndex", void 0);
class PostAltMetadata {
}
exports.PostAltMetadata = PostAltMetadata;
__decorate([
    (0, typegoose_1.prop)({ required: true, index: true }),
    __metadata("design:type", String)
], PostAltMetadata.prototype, "id", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], PostAltMetadata.prototype, "label", void 0);
class PostSimilarityMetadata {
}
exports.PostSimilarityMetadata = PostSimilarityMetadata;
__decorate([
    (0, typegoose_1.prop)({ required: true, index: true }),
    __metadata("design:type", String)
], PostSimilarityMetadata.prototype, "id", void 0);
class Post {
}
exports.Post = Post;
__decorate([
    (0, typegoose_1.prop)({ required: true, unique: true, index: true }),
    __metadata("design:type", String)
], Post.prototype, "sourceUrl", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: PostSeriesMetadata, required: false, _id: false }),
    __metadata("design:type", PostSeriesMetadata)
], Post.prototype, "series", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: PostAltMetadata, required: false, _id: false }),
    __metadata("design:type", PostAltMetadata)
], Post.prototype, "alt", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: PostSimilarityMetadata, required: false, _id: false }),
    __metadata("design:type", PostSimilarityMetadata)
], Post.prototype, "similarity", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], Post.prototype, "title", void 0);
__decorate([
    (0, typegoose_1.prop)({ enum: gallery_enums_1.PostType, type: String, required: true }),
    __metadata("design:type", String)
], Post.prototype, "contentType", void 0);
__decorate([
    (0, typegoose_1.prop)({ enum: gallery_enums_1.PostRating, type: String, required: true }),
    __metadata("design:type", String)
], Post.prototype, "rating", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: String, required: false }),
    __metadata("design:type", String)
], Post.prototype, "description", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: [String], required: true }),
    __metadata("design:type", Array)
], Post.prototype, "keywords", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Author, required: false, _id: false }),
    __metadata("design:type", Author)
], Post.prototype, "author", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: PostFile, required: true, _id: false }),
    __metadata("design:type", PostFile)
], Post.prototype, "file", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: PostAttachment, required: false, _id: false }),
    __metadata("design:type", PostAttachment)
], Post.prototype, "attachment", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: PostThumbnail, required: true, _id: false }),
    __metadata("design:type", PostThumbnail)
], Post.prototype, "thumbnail", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Date, required: true }),
    __metadata("design:type", Date)
], Post.prototype, "postedAt", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Date, required: true }),
    __metadata("design:type", Date)
], Post.prototype, "createdAt", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: Date, required: false }),
    __metadata("design:type", Date)
], Post.prototype, "removedAt", void 0);
__decorate([
    (0, typegoose_1.prop)({
        allowMixed: typegoose_1.Severity.ALLOW,
        type: mongoose_1.default.Schema.Types.Mixed,
        required: false,
        _id: false,
    }),
    __metadata("design:type", Object)
], Post.prototype, "originalData", void 0);
//# sourceMappingURL=post.model.js.map