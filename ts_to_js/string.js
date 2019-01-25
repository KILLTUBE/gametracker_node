export function strpadLeftOneZero(str) {
    if (str.length == 0)
        return "00";
    if (str.length == 1)
        return "0" + str;
    return str;
}
export function binary_escape(str) {
    var tmp = "";
    for (var i = 0; i < str.length; i++) {
        var char = str[i];
        var ord = str.charCodeAt(i);
        if ((ord >= 0 && ord <= 31) ||
            (ord >= 127 && ord <= 255)) {
            tmp += "\\x" + strpadLeftOneZero(ord.toString(16));
            continue;
        }
        if (ord == 34) {
            tmp += "\\\"";
            continue;
        }
        if (ord == 92) {
            tmp += "\\\\";
            continue;
        }
        tmp += char;
    }
    return tmp;
}
export function newBufferBinary(str) {
    var buf = new Buffer(str.length);
    for (var i = 0; i < str.length; i++)
        buf[i] = str.charCodeAt(i);
    return buf;
}
