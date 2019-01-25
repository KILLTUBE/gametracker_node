import { Globals } from "./Globals";
import { MysqlError } from "mysql";
import { updateGameserver, updateAll } from "./gameservers";
import { deleteCrapServers, queryMasterserver } from "./masterserver";

Globals.dgram = require("dgram");
Globals.fs = require('fs');

Globals.mysql = require("mysql").createConnection({
	//host: mysql_host,
	//port: mysql_port,
	socketPath: mysql_sock,
	user: mysql_user,
	password: mysql_pass
});
var fakeport = undefined; // make global
var debug = undefined;

Globals.mysql.query("USE " + mysql_database, function(err: MysqlError) {
	main();
});

export function main() {
	console.log("READY TO FIGHT");
	
	debug = false;
	//debug = true;
	if (debug)
	{
		fakeport = 666;
		updateGameserver("85.25.95.104", "28968");
	} else {
		updateAll();
		deleteCrapServers();
		queryMasterserver();
	}
}

export function repl() {
	var buffer = '';
	process.stdin.on('data', function(chunk) {
		buffer += chunk.toString('utf8');
	});
	require('repl').start({
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

repl();
