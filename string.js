function strpadLeftOneZero(str)
{
    if (str.length == 0)
        return "00";
    if (str.length == 1)
        return "0" + str;
    return str;
}
function binary_escape(str)
{
    tmp = "";
    for (var i=0; i<str.length; i++)
    {
        char = str[i];
        ord = str.charCodeAt(i);

        if (
            (ord >= 0 && ord <= 31) ||
            (ord >= 127 && ord <= 255)
        )
        {
            tmp += "\\x" + strpadLeftOneZero(ord.toString(16));
            continue;
        }
        if (ord == 34) // the char: "
        {
            tmp += "\\\"";
            continue;
        }
        if (ord == 92) // the char: "\\"
        {
            tmp += "\\\\";
            continue;
        }

        tmp += char;
    }
    return tmp;
}

function newBufferBinary(str)
{
	buf = new Buffer(str.length);
	for (var i=0; i<str.length; i++)
		buf[i] = str.charCodeAt(i);
	return buf;
}