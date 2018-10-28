exports.inArray = (needle, haystack, objectPath = null) => {
    var length = haystack.length;
    for (var i = 0; i < length; i++) {
        if (objectPath) {
            if (haystack[i][objectPath].toLowerCase() == needle.toLowerCase()) return true;
        } else {
            if (haystack[i].toLowerCase() == needle.toLowerCase()) return true;
        }
    }
    return false;
}