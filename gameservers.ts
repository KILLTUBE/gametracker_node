import { Globals, Gameserver } from "./Globals";
import { now, time } from "./time";
import { cod2_parse_status, strip_colorcodes } from "./cod2";
import { binary_escape } from "./string";

Globals.gameservers = {};

Globals.client = Globals.dgram.createSocket("udp4");
//client.setMaxListeners(0); // infinite


	//var message = new Buffer("\xff\xff\xff\xffgetstatus", 'binary'); // depricated -.-
	var message = newBufferBinary("\xff\xff\xff\xffGetstatus");
	
	Globals.client.on("message", function(msg, rinfo) {
		// using extra-vars for it caused errors -.-
		// they are interchanged on context-switches or so
		var ip = rinfo.address;
		var port = rinfo.port;
		//ip = rinfo.address;
		//port = rinfo.port;
		var response = msg.toString("binary");
		
		
		//console.log("on.data: " + rinfo.address + ":" + rinfo.port + ": " + response.substr(0, 15));
		
	
		// LOOOOOOOOOOOOOOOOOOOOOOOOOOOOOL
		// some asshole is sending own packet to this socket -> not in list = crash
		// lets see what he wrote!
		if (typeof Globals.gameservers[ip] == "undefined" ||
			typeof Globals.gameservers[ip][port] == "undefined" // LOL, here he even faked packet FROM REAL SERVER (or just from it), so i had to extend the if
		)
		{
			// SOME NETHERLANDER SPAMMED with gameserverquery-response xD
			//console.log("UNDEFINED!!!!!! " + ip + ":" + port);
			//console.log("GOT: \""+binary_escape(response)+"\"");
			return;
		}
		
		
		Globals.gameservers[ip][port].lastUpdate = now();
		
		// i query all 4 seconds, and if the packet needs more then 1s, then i cant provide each 5s a new packet
		var server_ping = Globals.gameservers[ip][port].lastUpdate - Globals.gameservers[ip][port].lastRequest;
		if (server_ping > 1000)
			console.log("hitch warning for " + ip + ":" + port + " "+server_ping+"ms");
		
		/*
		
		if (typeof fakeport != "undefined")
			port = fakeport; // so i can debug without crap-output for customers
		*/
		
		//if (response.substr(0, 4) == "\xFF\xFF\xFF\xFF")
		//	console.log("still binary here...");
		
		
		var status = cod2_parse_status(response);
		if (!status)
		{
			console.log("FAIL STATUS FOR " + rinfo.address + ":" + rinfo.port);
			return; // DO SOMETHING ELSE LIKE ANALYZE THE GAME
		}
		// TODO: abstract for ALL servers
		var game = "cod2";
		var map = status.cvars.mapname;
		var hostname = status.cvars.sv_hostname;
		var gametype = status.cvars.g_gametype;
		var fs_game = status.cvars.fs_game;
		var players = status.players.length;
		var max_players = status.cvars.sv_maxclients;
		var average_ping = 0;
		var hostname_nocolor = strip_colorcodes(hostname);
		var protocol = status.cvars.protocol;
		var password = status.cvars.pswrd;
		var anticheat = status.cvars.sv_punkbuster;
		if (max_players) {
			var counted = 0;
			for (var i=0; i<players; i++)
			{
				if (isNaN(status.players[i]["ping"]))
					continue;
				// IF NOT BOT BUT 999 PING:
				if (status.players[i]["name"].substr(0,3) != "bot" && status.players[i]["ping"] == 999) // dont count connection-interrupt/connecting
					continue;
				average_ping += status.players[i]["ping"];
				//console.log("i="+i + " ping=" + status.players[i]["ping"] + " avr="+average_ping); // had bug, concated strings instead of adding
				
				counted++;
			}
			if (counted)
				average_ping /= counted;
			//if (players != counted)
			//	console.log("players="+players + " counted=" + counted);
		}
		var version = status.cvars.shortversion;
		
		if (Globals.debug)
			console.log("game="+game + " hostname="+hostname + " map="+map + " gametype="+gametype + " fs_game="+fs_game + " players="+players + " max_players="+max_players + " average_ping="+average_ping + " version="+version);
		
		var binary_response = binary_escape(response);
		//console.log(binary_response);
		Globals.mysql.query("	\
				INSERT INTO	\
					servers/*_debug*/ (ip, port, time_added, last_actualize, status,  game, map, hostname, gametype, fs_game, players, max_players, average_ping, version, hostname_nocolor, protocol, password, anticheat, server_ping)	\
				VALUES	\
					(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)	\
				ON DUPLICATE KEY UPDATE	\
					last_actualize = ?,	\
					status = ?,	\
					game = ?,	\
					map = ?,	\
					hostname = ?,	\
					gametype = ?,	\
					fs_game = ?,	\
					players = ?,	\
					max_players = ?,	\
					average_ping = ?,	\
					version = ?,	\
					hostname_nocolor = ?,	\
					protocol = ?,	\
					password = ?,	\
					anticheat = ?,	\
					server_ping = ?	\
		", [rinfo.address, rinfo.port, time(), time(), binary_response,
		
		
			game, map, hostname, gametype, fs_game, players, max_players, average_ping, version, hostname_nocolor, protocol, password, anticheat, server_ping,
		
			time(), binary_response,
			game, map, hostname, gametype, fs_game, players, max_players, average_ping, version, hostname_nocolor, protocol, password, anticheat, server_ping
		], function(err, result, fields){
			if (err)
			{
				console.log(err);
				return;
			}
			
			//console.log("QUERY DONE");
		});
		
		// dont use ip/port in the mysql-callback, that fails, because its wrong context,
		// BUT it works, if i write: var ip=... and i dont know why
		//console.log(rinfo.address + ":" + rinfo.port + "= all fine for " + ip + ":" + port);
	});

	Globals.client.on("error", function(err){
		console.log("UDP-Socket: ERROR! " + err);
	});
	
	Globals.client.on("close", function(){
		console.log("UDP-Socket: CLOSE!");
	});
	Globals.client.on("listening", function(){
		console.log("UDP-Socket: LISTENING!");
	});
	Globals.client.on("end", function(){
		console.log("UDP-Socket: END!");
	});


export function updateGameserver(ip: string, port: string/*, fakeport*/) // fakeport is global now, because cant get it through the event -.-
{
	if (typeof Globals.gameservers[ip] == "undefined")
		Globals.gameservers[ip] = {}; // assoc array
	if (typeof Globals.gameservers[ip][port] == "undefined")
		Globals.gameservers[ip][port] = new Gameserver; // assoc array
		
	var deltaUpdate = now() - Globals.gameservers[ip][port].lastUpdate;
	var deltaRequest = now() - Globals.gameservers[ip][port].lastRequest;
	
	if (deltaUpdate < 4000 || deltaRequest < 4000) {
		//console.log("no need for update, deltaUpdate=" + deltaUpdate);
		return;
	}
	
	if (ip == "87.118.124.187" || ip == "86.4.82.41" || ip == "185.46.53.126") { //last one blocked cause doubles
		// console.log("BLOCKED BLOCKED BLOCKED: "+ip+":"+port);
		return;
	}
	
	//console.log(ip + ":" + port + " deltaUpdate=" + deltaUpdate + " deltaRequest=" + deltaRequest);
	
	Globals.gameservers[ip][port].lastRequest = now();
	
	
	/*
	
ADD SERVER: 111
ADD SERVER: 111
ADD SERVER: 111
ADD SERVER: 111
ADD SERVER: 111
ADD SERVER: 111
ADD SERVER: 30
result.length=1266
UDP-Socket: ERROR! Error: getaddrinfo ENOTFOUND
UDP-Socket: ERROR! Error: getaddrinfo ENOTFOUND

dgram.js:265
    throw new RangeError('Port should be > 0 and < 65536');
    ^
RangeError: Port should be > 0 and < 65536
    at Socket.send (dgram.js:265:11)
    at updateGameserver (/home/k_tracker/debug.js:1:10613)
    at Socket.<anonymous> (/home/k_tracker/debug.js:1:14433)
    at Socket.EventEmitter.emit (events.js:98:17)
    at UDP.onMessage (dgram.js:437:8)

	*/
	
	
	//client._bound = true; // lol fake
	try {
		Globals.client.send(message, 0, message.length, port, ip, function(err, bytes) {
			//console.log("client.send: test bytes="+bytes + "err=" + err);
			//console.log("client.send: " + message + " ");
		});
	} catch (e) {
		// e...
	}
}

export function updateAll() {
	//mysql.debug = true;
	// thought that would be faster, but its just more queries = slower
	// WHERE last_actualize + 2 < " + time() + " 
	// hm, without its 19% cpu and with filter its 15%
	Globals.mysql.query("SELECT ip, port FROM servers/*_debug*/ ORDER BY last_actualize ASC", function(err, result, fields) {
		if (err)
		{
			console.log(err);
			return;
		}
		
		console.log("result.length=" + result.length);
		
		for (var i in result)
		{
			var server = result[i];
			var ip = server.ip;
			var port = server.port;
			updateGameserver(ip, port);
		}
		
		//console.log("DONE!");
		setTimeout(updateAll, 1000 * 2);
		//setTimeout(updateWithoutMysql, 1000 * 1);
	});
}

// the bad thing is, that i dont see ip's added by PHP
export function updateWithoutMysql() {
	// might be usefull to debug, but its spamming every second
	//console.log("updateWithoutMysql()");
	
	for (var ip_ in Globals.gameservers) {
		var gameserver = Globals.gameservers[ip_];
		
		for (var port_ in gameserver) {
			//console.log(ip + ":" + port);
			updateGameserver(ip_, port_);
		}
		
	}
	
	setTimeout(updateWithoutMysql, 1000 * 1);
}
