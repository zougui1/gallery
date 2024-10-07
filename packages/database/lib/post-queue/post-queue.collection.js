"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostQueueCollection = void 0;
const post_queue_schema_1 = require("./post-queue.schema");
const post_queue_model_1 = require("./post-queue.model");
const utils_1 = require("../utils");
class PostQueueCollection {
    constructor(connection) {
        this.schema = {
            postQueue: post_queue_schema_1.postQueueSchema,
        };
        this.createOne = async (data) => {
            const document = await this.model.create(post_queue_schema_1.postQueueSchema.parse(data));
            return this.deserialize(document);
        };
        this.createMany = async (data) => {
            const documents = await this.model.create(data.map(item => post_queue_schema_1.postQueueSchema.parse(item)));
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
            return Object.assign(Object.assign({}, post_queue_schema_1.postQueueSchema.parse(document)), { _id: document._id.toString() });
        };
        this.model = (0, utils_1.getModel)('post-queues', post_queue_model_1.PostQueue, {
            connection,
        });
    }
}
exports.PostQueueCollection = PostQueueCollection;
//# sourceMappingURL=post-queue.collection.js.map