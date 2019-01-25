import { str_replace } from "./php";

export function parse_cvars_2(str: string) {
	var cvars: {[key: string]: string} = {};
	var split = str.split("\\");
	for (var i=1; i<split.length; i+=2) {
		var key = split[i];
		var value = split[i+1];
		cvars[key] = value;
	}
	return cvars;
}

export function cod2_parse_status($status: string) {
	// $parts[0] = \xFF\xFF\xFF\xFFstatusResponse
	// $parts[1] = \fs_game\bots\g_antilag\1\g_gametype\tdm
	// $parts[...] = 0 37 "^^00S^^33uicide^^00C^^33ommando"
	// so atleast 2 elements, else something failed
	var $parts = $status.split("\n");
	
	// figure out some possible errors
	if ($parts.length < 2)
		return false;
	if ($parts[0] != "\xFF\xFF\xFF\xFFstatusResponse")
		return false;

	// parse the players
	var $players = new Array();
	var $len = $parts.length - 1; // -1 for the \n behind every player
	for (var $i=2; $i<$len; $i++) {
		var $line = $parts[$i];
		
		/*
		$tmp = explode("\x20", $parts[$i]);
		$score = $tmp[0];
		$ping = $tmp[1];
		$name = substr($tmp[2], 1, -1); // remove the quotation marks like: "<name>"
		*/
		
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
	}
}

export function strip_colorcodes(text: string) {
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
	
	// yes twice, because some idiots are too stupid
	// (e.g. that double-colors just make sense for names ingame / just making ONE ^)
	return text;
}
