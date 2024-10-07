"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeTrailing = void 0;
const removeTrailing = (str, subStr) => {
    if (!subStr.length || !str.endsWith(subStr)) {
        return str;
    }
    return str.slice(0, -subStr.length);
};
exports.removeTrailing = removeTrailing;
//# sourceMappingURL=removeTrailing.js.map