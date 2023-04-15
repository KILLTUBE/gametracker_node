import { State                                                   } from "./Globals.mjs";
import { updateGameserver, updateAll, gameservers_init           } from "./gameservers.mjs";
import { deleteCrapServers, queryMasterserver, masterserver_init } from "./masterserver.mjs";
import { mysql_sock, mysql_user, mysql_pass, mysql_database      } from "./config.mjs";
import * as dgram from "dgram";
import * as fs from "fs";
import * as mysql from "mysql";
import * as repl from "repl";
State.dgram = dgram;
State.fs = fs;
State.mysql = mysql.createConnection({
  //host: mysql_host,
  //port: mysql_port,
  socketPath: mysql_sock,
  user: mysql_user,
  password: mysql_pass
});
var fakeport = undefined; // make global
var debug = undefined;
State.mysql.query("USE " + mysql_database, function(err) {
  main();
});
export function main() {
  console.log("READY TO FIGHT");
  gameservers_init();
  masterserver_init();
  debug = false;
  //debug = true;
  if (debug)
  {
    fakeport = 666;
    updateGameserver("85.25.95.104", 28968);
  } else {
    updateAll();
    deleteCrapServers();
    queryMasterserver();
  }
}
export function startREPL() {
  var buffer = '';
  process.stdin.on('data', function(chunk) {
    buffer += chunk.toString('utf8');
  });
  repl.start({
    input: process.stdin,
    output: process.stdout,
    'eval': function (cmd, context, filename, callback) {
      console.log(buffer);
      try {
        callback(null, eval(buffer));
      } catch (e) {
        console.log(e);
      }
      buffer = '';
    }
  });
}
startREPL();
