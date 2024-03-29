import { State, Gameserver                   } from "./Globals.mjs";
import { now, time                           } from "./time.mjs";
import { cod2_parse_status, strip_colorcodes } from "./cod2.mjs";
import { binary_escape, newBufferBinary      } from "./string.mjs";
export function gameservers_init() {
  State.client = State.dgram.createSocket("udp4");
  //client.setMaxListeners(0); // infinite
  //var message = new Buffer("\xff\xff\xff\xffgetstatus", 'binary'); // depricated -.-
  State.message = newBufferBinary("\xff\xff\xff\xffGetstatus");
  State.client.on("message", function(msg, rinfo) {
    // using extra-vars for it caused errors -.-
    // they are interchanged on context-switches or so
    const ip = rinfo.address;
    const port = rinfo.port;
    //ip = rinfo.address;
    //port = rinfo.port;
    const response = msg.toString("binary");
    //console.log("on.data: " + rinfo.address + ":" + rinfo.port + ": " + response.substr(0, 15));
    // LOOOOOOOOOOOOOOOOOOOOOOOOOOOOOL
    // some asshole is sending own packet to this socket -> not in list = crash
    // lets see what he wrote!
    if (typeof State.gameservers[ip] == "undefined" ||
      typeof State.gameservers[ip][port] == "undefined" // LOL, here he even faked packet FROM REAL SERVER (or just from it), so i had to extend the if
    ) {
      // SOME NETHERLANDER SPAMMED with gameserverquery-response xD
      //console.log("UNDEFINED!!!!!! " + ip + ":" + port);
      //console.log("GOT: \""+binary_escape(response)+"\"");
      return;
    }
    const gameserver = State.gameservers[ip][port];
    gameserver.lastUpdate = now();
    // i query all 4 seconds, and if the packet needs more then 1s, then i cant provide each 5s a new packet
    const server_ping = gameserver.lastUpdate - gameserver.lastRequest;
    if (server_ping > 1000) {
      console.log("hitch warning for " + ip + ":" + port + " "+server_ping+"ms");
    }
    /*
    if (typeof fakeport != "undefined")
      port = fakeport; // so i can debug without crap-output for customers
    */
    //if (response.substr(0, 4) == "\xFF\xFF\xFF\xFF")
    //  console.log("still binary here...");
    const status = cod2_parse_status(response);
    if (!status) {
      console.log("FAIL STATUS FOR " + rinfo.address + ":" + rinfo.port);
      return; // DO SOMETHING ELSE LIKE ANALYZE THE GAME
    }
    // TODO: abstract for ALL servers
    const game = "cod2";
    const map = status.cvars.mapname;
    const hostname = status.cvars.sv_hostname;
    const gametype = status.cvars.g_gametype;
    const fs_game = status.cvars.fs_game;
    let players = status.players.length;
    const max_players = status.cvars.sv_maxclients;
    const hostname_nocolor = strip_colorcodes(hostname);
    const protocol = status.cvars.protocol;
    const password = status.cvars.pswrd;
    const anticheat = status.cvars.sv_punkbuster;
    let average_ping = 0;
    //if (max_players)
    {
      let num_valid_players = 0;
      for (var i=0; i<players; i++) {
        const player = status.players[i];
        const { ping } = player;
        if (isNaN(ping)) {
          continue;
        }
        // IF NOT BOT BUT 999 PING:
        //if (player["name"].substr(0,3) != "bot" && players["ping"] == 999) // dont count connection-interrupt/connecting
        if (ping === 0) {
          continue;
        }
        if (ping === 999) {
          continue;
        }
        average_ping += ping;
        //console.log("i="+i + " ping=" + players["ping"] + " avr="+average_ping); // had bug, concated strings instead of adding
        num_valid_players++;
      }
      if (num_valid_players) {
        average_ping /= num_valid_players;
      }
      // reduce bots from player count
      players = num_valid_players;
      //if (players != counted)
      //  console.log("players="+players + " counted=" + counted);
    }
    var version = status.cvars.shortversion;
    if (State.debug) {
      console.log("game="+game + " hostname="+hostname + " map="+map + " gametype="+gametype + " fs_game="+fs_game + " players="+players + " max_players="+max_players + " average_ping="+average_ping + " version="+version);
    }
    var binary_response = binary_escape(response);
    //console.log(binary_response);
    State.mysql.query("  \
        INSERT INTO  \
          servers/*_debug*/ (ip, port, time_added, last_actualize, status,  game, map, hostname, gametype, fs_game, players, max_players, average_ping, version, hostname_nocolor, protocol, password, anticheat, server_ping)  \
        VALUES \
          (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) \
        ON DUPLICATE KEY UPDATE  \
          last_actualize   = ?, \
          status           = ?, \
          game             = ?, \
          map              = ?, \
          hostname         = ?, \
          gametype         = ?, \
          fs_game          = ?, \
          players          = ?, \
          max_players      = ?, \
          average_ping     = ?, \
          version          = ?, \
          hostname_nocolor = ?, \
          protocol         = ?, \
          password         = ?, \
          anticheat        = ?, \
          server_ping      = ?  \
    ", [
      rinfo.address, rinfo.port, time(), time(), binary_response,
      game, map, hostname, gametype, fs_game, players, max_players, average_ping, version, hostname_nocolor, protocol, password, anticheat, server_ping,
      time(), binary_response,
      game, map, hostname, gametype, fs_game, players, max_players, average_ping, version, hostname_nocolor, protocol, password, anticheat, server_ping
    ], function(err, result, fields) {
      if (err) {
        console.log(err);
        return;
      }
      //console.log("QUERY DONE");
    });
    // dont use ip/port in the mysql-callback, that fails, because its wrong context,
    // BUT it works, if i write: var ip=... and i dont know why
    //console.log(rinfo.address + ":" + rinfo.port + "= all fine for " + ip + ":" + port);
  });
  State.client.on("error", function(err){
    console.log("UDP-Socket: ERROR! " + err);
  });
  State.client.on("close", function(){
    console.log("UDP-Socket: CLOSE!");
  });
  State.client.on("listening", function(){
    console.log("UDP-Socket: LISTENING!");
  });
  State.client.on("end", function(){
    console.log("UDP-Socket: END!");
  });
}
/**
 * @param {string} ip - The IP.
 * @param {number} port - The port.
 */
export function updateGameserver(ip, port/*, fakeport*/) { // fakeport is global now, because cant get it through the event -.-
  if (typeof State.gameservers[ip] === "undefined") {
    State.gameservers[ip] = {}; // assoc array
  }
  if (typeof State.gameservers[ip][port] === "undefined") {
    State.gameservers[ip][port] = new Gameserver; // assoc array
  }
  const deltaUpdate  = now() - State.gameservers[ip][port].lastUpdate;
  const deltaRequest = now() - State.gameservers[ip][port].lastRequest;
  if (deltaUpdate < 4000 || deltaRequest < 4000) {
    //console.log("no need for update, deltaUpdate=" + deltaUpdate);
    return;
  }
  if (ip == "87.118.124.187" || ip == "86.4.82.41" || ip == "185.46.53.126") { //last one blocked cause doubles
    // console.log("BLOCKED BLOCKED BLOCKED: "+ip+":"+port);
    return;
  }
  //console.log(ip + ":" + port + " deltaUpdate=" + deltaUpdate + " deltaRequest=" + deltaRequest);
  State.gameservers[ip][port].lastRequest = now();
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
    State.client.send(State.message, 0, State.message.length, port, ip, function(err, bytes) {
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
  State.mysql.query("SELECT ip, port FROM servers/*_debug*/ ORDER BY last_actualize ASC", function(err, result, fields) {
    if (err) {
      console.log(err);
      return;
    }
    console.log("result.length=" + result.length);
    for (var i in result) {
      const server = result[i];
      const { ip, port } = server;
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
  for (const ip_ in State.gameservers) {
    const ports = State.gameservers[ip_];
    for (const port_ in ports) {
      //console.log(ip + ":" + port);
      updateGameserver(ip_, Number(port_));
    }
  }
  setTimeout(updateWithoutMysql, 1000 * 1);
}
