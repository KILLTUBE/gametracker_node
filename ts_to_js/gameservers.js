import { State, Gameserver } from "./Globals";
import { now, time } from "./time";
import { cod2_parse_status, strip_colorcodes } from "./cod2";
import { binary_escape, newBufferBinary } from "./string";
export function gameservers_init() {
    State.gameservers = {};
    State.client = State.dgram.createSocket("udp4");
    State.message = newBufferBinary("\xff\xff\xff\xffGetstatus");
    State.client.on("message", function (msg, rinfo) {
        var ip = rinfo.address;
        var port = rinfo.port;
        var response = msg.toString("binary");
        if (typeof State.gameservers[ip] == "undefined" ||
            typeof State.gameservers[ip][port] == "undefined") {
            return;
        }
        State.gameservers[ip][port].lastUpdate = now();
        var server_ping = State.gameservers[ip][port].lastUpdate - State.gameservers[ip][port].lastRequest;
        if (server_ping > 1000)
            console.log("hitch warning for " + ip + ":" + port + " " + server_ping + "ms");
        var status = cod2_parse_status(response);
        if (!status) {
            console.log("FAIL STATUS FOR " + rinfo.address + ":" + rinfo.port);
            return;
        }
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
            for (var i = 0; i < players; i++) {
                if (isNaN(status.players[i]["ping"]))
                    continue;
                if (status.players[i]["name"].substr(0, 3) != "bot" && status.players[i]["ping"] == 999)
                    continue;
                average_ping += status.players[i]["ping"];
                counted++;
            }
            if (counted)
                average_ping /= counted;
        }
        var version = status.cvars.shortversion;
        if (State.debug)
            console.log("game=" + game + " hostname=" + hostname + " map=" + map + " gametype=" + gametype + " fs_game=" + fs_game + " players=" + players + " max_players=" + max_players + " average_ping=" + average_ping + " version=" + version);
        var binary_response = binary_escape(response);
        State.mysql.query("	\
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
        ], function (err, result, fields) {
            if (err) {
                console.log(err);
                return;
            }
        });
    });
    State.client.on("error", function (err) {
        console.log("UDP-Socket: ERROR! " + err);
    });
    State.client.on("close", function () {
        console.log("UDP-Socket: CLOSE!");
    });
    State.client.on("listening", function () {
        console.log("UDP-Socket: LISTENING!");
    });
    State.client.on("end", function () {
        console.log("UDP-Socket: END!");
    });
}
export function updateGameserver(ip, port) {
    if (typeof State.gameservers[ip] == "undefined")
        State.gameservers[ip] = {};
    if (typeof State.gameservers[ip][port] == "undefined")
        State.gameservers[ip][port] = new Gameserver;
    var deltaUpdate = now() - State.gameservers[ip][port].lastUpdate;
    var deltaRequest = now() - State.gameservers[ip][port].lastRequest;
    if (deltaUpdate < 4000 || deltaRequest < 4000) {
        return;
    }
    if (ip == "87.118.124.187" || ip == "86.4.82.41" || ip == "185.46.53.126") {
        return;
    }
    State.gameservers[ip][port].lastRequest = now();
    try {
        State.client.send(State.message, 0, State.message.length, port, ip, function (err, bytes) {
        });
    }
    catch (e) {
    }
}
export function updateAll() {
    State.mysql.query("SELECT ip, port FROM servers/*_debug*/ ORDER BY last_actualize ASC", function (err, result, fields) {
        if (err) {
            console.log(err);
            return;
        }
        console.log("result.length=" + result.length);
        for (var i in result) {
            var server = result[i];
            var ip = server.ip;
            var port = server.port;
            updateGameserver(ip, port);
        }
        setTimeout(updateAll, 1000 * 2);
    });
}
export function updateWithoutMysql() {
    for (var ip_ in State.gameservers) {
        var ports = State.gameservers[ip_];
        for (var port_ in ports) {
            updateGameserver(ip_, Number(port_));
        }
    }
    setTimeout(updateWithoutMysql, 1000 * 1);
}
