export const _getPosition = e => {
    var left = 0;
    var top = 0;

    while (e.offsetParent !== undefined && e.offsetParent !== null) {
        left += e.offsetLeft + (e.clientLeft !== null ? e.clientLeft : 0);
        top += e.offsetTop + (e.clientTop !== null ? e.clientTop : 0);
        e = e.offsetParent;
    }
    return {top, left};
}

export const _b64ToBlob = (imageUrlB64, sliceSize) => {
    const block = imageUrlB64.split(';');
    const contentType = block[0].split(':')[1];
    const b64Data = block[1].split(',')[1];
    sliceSize = sliceSize || 512;

    const byteCharacters = atob(b64Data);
    let byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        let slice = byteCharacters.slice(offset, offset + sliceSize);
        let byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        let byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
}

export const _passwordMatch = (confirmation, state) => (state.password === confirmation);

export const _inArray = (needle, haystack, objectPath = null) => {
    var length = haystack.length;
    for (var i = 0; i < length; i++) {
        if(objectPath) {
            if(haystack[i][objectPath].toLowerCase() === needle.toLowerCase()) return true;
        } else {
            if(haystack[i].toLowerCase() === needle.toLowerCase()) return true;
        }
    }
    return false;
}
