"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.busyStatuses = exports.deletableStatuses = exports.permanentlyDeletableStatuses = exports.postQueueStatusValues = exports.postQueueStatusLabelMap = exports.PostQueueStatus = void 0;
const utils_1 = require("./utils");
var PostQueueStatus;
(function (PostQueueStatus) {
    /**
     * pseudo status
     */
    PostQueueStatus["idle"] = "idle";
    /**
     * fetching a submission's metadata (title, description, keywords, etc...)
     */
    PostQueueStatus["fetchingData"] = "fetchingData";
    /**
     * downloading a submission's files (thumbnail, art/video/story/etc...)
     */
    PostQueueStatus["downloadingContent"] = "downloadingContent";
    /**
     * processing a submission's thumbnail and content file
     */
    PostQueueStatus["processing"] = "processing";
    PostQueueStatus["checkingDuplicates"] = "checkingDuplicates";
    /**
     * scanning the database for similar posts
     */
    PostQueueStatus["scanningSimilarities"] = "scanningSimilarities";
    /**
     * submission's process pipeline complete and ready to be visualized in the gallery
     */
    PostQueueStatus["complete"] = "complete";
    PostQueueStatus["ignored"] = "ignored";
    PostQueueStatus["restarted"] = "restarted";
    PostQueueStatus["error"] = "error";
    /**
     * deleting the submission's files
     */
    PostQueueStatus["deleting"] = "deleting";
    /**
     * submission files deleted from the drive and post document deleted from collection
     */
    PostQueueStatus["deleted"] = "deleted";
})(PostQueueStatus || (exports.PostQueueStatus = PostQueueStatus = {}));
exports.postQueueStatusLabelMap = {
    idle: 'idle',
    fetchingData: 'fetching data',
    downloadingContent: 'downloading content',
    processing: 'processing',
    checkingDuplicates: 'checking duplicates',
    scanningSimilarities: 'scanning similarities',
    complete: 'complete',
    ignored: 'ignored',
    restarted: 'restarted',
    error: 'error',
    deleting: 'deleting',
    deleted: 'deleted',
};
exports.postQueueStatusValues = (0, utils_1.getEnumValues)(PostQueueStatus);
exports.permanentlyDeletableStatuses = [
    PostQueueStatus.error,
    PostQueueStatus.deleted,
    PostQueueStatus.ignored,
];
exports.deletableStatuses = [
    PostQueueStatus.complete,
];
exports.busyStatuses = [
    PostQueueStatus.fetchingData,
    PostQueueStatus.downloadingContent,
    PostQueueStatus.processing,
    PostQueueStatus.checkingDuplicates,
    PostQueueStatus.deleting,
];
//# sourceMappingURL=PostQueueStatus.js.map