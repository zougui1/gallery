export const getPosition = e => {
    var left = 0;
    var top = 0;

    while (e.offsetParent !== undefined && e.offsetParent != null) {
        left += e.offsetLeft + (e.clientLeft != null ? e.clientLeft : 0);
        top += e.offsetTop + (e.clientTop != null ? e.clientTop : 0);
        e = e.offsetParent;
    }
    return {top, left};
}