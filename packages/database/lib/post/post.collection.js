"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostCollection = void 0;
const post_schema_1 = require("./post.schema");
const post_model_1 = require("./post.model");
const utils_1 = require("../utils");
class PostCollection {
    constructor(connection) {
        this.schema = {
            file: post_schema_1.fileSchema,
            imageFile: post_schema_1.imageFileSchema,
            textFile: post_schema_1.textFileSchema,
            post: post_schema_1.postSchema,
        };
        this.createOne = async (data) => {
            const document = await this.model.create(post_schema_1.postSchema.parse(data));
            return this.deserialize(document);
        };
        this.createMany = async (data) => {
            const documents = await this.model.create(data.map(item => post_schema_1.postSchema.parse(item)));
            return documents.map(this.deserialize);
        };
        this.find = (filter, options) => {
            return this.model
                .find(filter !== null && filter !== void 0 ? filter : {}, {}, options)
                .lean()
                .transform(data => data.map(this.deserialize));
        };
        this.findById = (id, options) => {
            return this.model
                .findById(id, {}, options)
                .transform(data => data ? this.deserialize(data) : data);
        };
        this.findByIdAndDelete = (id, options) => {
            return this.model
                .findByIdAndDelete(id, options)
                .transform(data => data ? this.deserialize(data) : data);
        };
        this.findByIdAndUpdate = (id, update, options) => {
            return this.model
                .findByIdAndUpdate(id, update, options)
                .transform(data => data ? this.deserialize(data) : data);
        };
        this.findOne = (filter, options) => {
            return this.model
                .findOne(filter, {}, options)
                .transform(data => data ? this.deserialize(data) : data);
        };
        this.findOneAndDelete = (filter, options) => {
            return this.model
                .findOneAndDelete(filter, options)
                .transform(data => data ? this.deserialize(data) : data);
        };
        this.findOneAndUpdate = (filter, update, options) => {
            return this.model
                .findOneAndUpdate(filter, update, options)
                .transform(data => data ? this.deserialize(data) : data);
        };
        this.updateMany = (filter, update, options) => {
            return this.model.updateMany(filter, update, options);
        };
        this.updateOne = (filter, update, options) => {
            return this.model.updateOne(filter, update, options);
        };
        this.deleteMany = (filter, options) => {
            return this.model.deleteMany(filter, options);
        };
        this.deleteOne = (filter, options) => {
            return this.model.deleteOne(filter, options);
        };
        this.replaceOne = (filter, replacement, options) => {
            return this.model.replaceOne(filter, replacement, options);
        };
        this.aggregate = (pipeline, options) => {
            return this.model.aggregate(pipeline, options);
        };
        this.distinct = (field, filter, options) => {
            return this.model.distinct(field, filter, options);
        };
        this.deserialize = (document) => {
            return Object.assign(Object.assign({}, post_schema_1.postSchema.parse(document)), { _id: document._id.toString() });
        };
        this.model = (0, utils_1.getModel)('posts', post_model_1.Post, {
            connection,
        });
    }
}
exports.PostCollection = PostCollection;
//# sourceMappingURL=post.collection.js.map