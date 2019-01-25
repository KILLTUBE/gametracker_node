import { str_replace } from "./php";
export function parse_cvars_2(str) {
    var cvars = {};
    var split = str.split("\\");
    for (var i = 1; i < split.length; i += 2) {
        var key = split[i];
        var value = split[i + 1];
        cvars[key] = value;
    }
    return cvars;
}
export function cod2_parse_status($status) {
    var $parts = $status.split("\n");
    if ($parts.length < 2)
        return false;
    if ($parts[0] != "\xFF\xFF\xFF\xFFstatusResponse")
        return false;
    var $players = new Array();
    var $len = $parts.length - 1;
    for (var $i = 2; $i < $len; $i++) {
        var $line = $parts[$i];
        var $tmp = $line.split("\"");
        var $before = $tmp[0];
        var $tmp2 = $before.split(" ");
        var $score = $tmp2[0];
        var $ping = parseInt($tmp2[1]);
        var $name = $tmp[1];
        $players.push({
            "score": $score,
            "ping": $ping,
            "name": $name
        });
    }
    return {
        "cvars": parse_cvars_2($parts[1]),
        "players": $players
    };
}
export function strip_colorcodes(text) {
    text = str_replace("^0", "", text);
    text = str_replace("^1", "", text);
    text = str_replace("^2", "", text);
    text = str_replace("^3", "", text);
    text = str_replace("^4", "", text);
    text = str_replace("^5", "", text);
    text = str_replace("^6", "", text);
    text = str_replace("^7", "", text);
    text = str_replace("^8", "", text);
    text = str_replace("^9", "", text);
    text = str_replace("^0", "", text);
    text = str_replace("^1", "", text);
    text = str_replace("^2", "", text);
    text = str_replace("^3", "", text);
    text = str_replace("^4", "", text);
    text = str_replace("^5", "", text);
    text = str_replace("^6", "", text);
    text = str_replace("^7", "", text);
    text = str_replace("^8", "", text);
    text = str_replace("^9", "", text);
    return text;
}
