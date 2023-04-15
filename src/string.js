/**
 * @param {string} str 
 * @returns {string}
 */
export function strpadLeftOneZero(str) {
  if (str.length === 0) {
    return "00";
  }
  if (str.length === 1) {
    return "0" + str;
  }
  return str;
}
/**
 * @param {string} str 
 * @returns {string}
 */
export function binary_escape(str) {
  var tmp = "";
  for (var i=0; i<str.length; i++) {
    const char = str[i];
    const ord = str.charCodeAt(i);
    if (
      (ord >=   0 && ord <= 31 ) ||
      (ord >= 127 && ord <= 255)
    ) {
      tmp += "\\x" + strpadLeftOneZero(ord.toString(16));
      continue;
    }
    if (ord == 34) { // the char: "
      tmp += "\\\"";
      continue;
    }
    if (ord == 92) { // the char: "\\"
      tmp += "\\\\";
      continue;
    }
    tmp += char;
  }
  return tmp;
}
/**
 * @param {string} str 
 * @returns {Buffer}
 */
export function newBufferBinary(str) {
  const buf = new Buffer(str.length);
  for (var i=0; i<str.length; i++) {
    buf[i] = str.charCodeAt(i);
  }
  return buf;
}
