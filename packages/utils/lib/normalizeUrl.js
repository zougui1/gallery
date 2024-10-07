"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeUrl = void 0;
const furaffinity_1 = require("@zougui/furaffinity");
const removeTrailing_1 = require("./removeTrailing");
const normalizedHostNames = {
    furaffinity: 'www.furaffinity.net',
};
const normalizeUrl = (url) => {
    if (furaffinity_1.FurAffinityClient.URL.checkIsValidHostName(url)) {
        return (0, removeTrailing_1.removeTrailing)(furaffinity_1.FurAffinityClient.URL.normalizeHostName(url, normalizedHostNames.furaffinity), '/');
    }
    return (0, removeTrailing_1.removeTrailing)(url, '/');
};
exports.normalizeUrl = normalizeUrl;
//# sourceMappingURL=normalizeUrl.js.map