import { State } from "./Globals";
import { updateGameserver, updateAll, gameservers_init } from "./gameservers";
import { deleteCrapServers, queryMasterserver, masterserver_init } from "./masterserver";
import { mysql_sock, mysql_user, mysql_pass, mysql_database } from "./config";
State.dgram = require("dgram");
State.fs = require('fs');
State.mysql = require("mysql").createConnection({
    socketPath: mysql_sock,
    user: mysql_user,
    password: mysql_pass
});
var fakeport = undefined;
var debug = undefined;
State.mysql.query("USE " + mysql_database, function (err) {
    main();
});
export function main() {
    console.log("READY TO FIGHT");
    gameservers_init();
    masterserver_init();
    debug = false;
    if (debug) {
        fakeport = 666;
        updateGameserver("85.25.95.104", 28968);
    }
    else {
        updateAll();
        deleteCrapServers();
        queryMasterserver();
    }
}
export function repl() {
    var buffer = '';
    process.stdin.on('data', function (chunk) {
        buffer += chunk.toString('utf8');
    });
    require('repl').start({
        input: process.stdin,
        output: process.stdout,
        'eval': function (cmd, context, filename, callback) {
            console.log(buffer);
            try {
                callback(null, eval(buffer));
            }
            catch (e) {
                console.log(e);
            }
            buffer = '';
        }
    });
}
repl();
