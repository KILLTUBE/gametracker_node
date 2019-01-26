import { State } from "./Globals";
import { updateGameserver } from "./gameservers";
import { newBufferBinary, strpadLeftOneZero } from "./string";
export function masterserver_init() {
    State.master = State.dgram.createSocket("udp4");
    State.master.on("message", function (msg, rinfo) {
        var ip = rinfo.address;
        var port = rinfo.port;
        var response = msg.toString("binary");
        var expectHeader = "\xFF\xFF\xFF\xFFgetserversResponse\x0A\x00";
        var expectFootA = "\\EOT";
        var expectFootB = "\\EOF";
        var start = expectHeader.length;
        var end = response.length - expectFootA.length;
        var count = 0;
        for (var i = start; i < end; i += 7) {
            var a = response.charCodeAt(i + 1);
            var b = response.charCodeAt(i + 2);
            var c = response.charCodeAt(i + 3);
            var d = response.charCodeAt(i + 4);
            ip = a + "." + b + "." + c + "." + d;
            port = 1337;
            var portA = strpadLeftOneZero(response.charCodeAt(i + 5).toString(16));
            var portB = strpadLeftOneZero(response.charCodeAt(i + 6).toString(16));
            port = parseInt(portA + portB, 16);
            count++;
            updateGameserver(ip, port);
        }
        console.log("ADD SERVER: " + count);
        return;
    });
    State.master.on("error", function (err) {
        console.log("UDP-Socket: ERROR! " + err);
    });
    State.master.on("close", function () {
        console.log("UDP-Socket: CLOSE!");
    });
    State.master.on("listening", function () {
        console.log("UDP-Socket: LISTENING!");
    });
    State.master.on("end", function () {
        console.log("UDP-Socket: END!");
    });
}
export function queryUDP(ip, port, id) {
    var message = newBufferBinary("\xFF\xFF\xFF\xFFgetservers " + id + " full empty");
    State.master.send(message, 0, message.length, port, ip, function (err, bytes) {
    });
}
export function queryMasterserver() {
    queryUDP("cod2master.activision.com", 20710, 115);
    queryUDP("cod2master.activision.com", 20710, 117);
    queryUDP("cod2master.activision.com", 20710, 118);
    console.log("UPDATED SERVERS FROM MASTER!");
    setTimeout(queryMasterserver, 1000 * 10);
}
export function deleteCrapServers() {
    State.mysql.query("DELETE FROM servers WHERE last_actualize < unix_timestamp()-60*60*1*24", function (err, result, fields) {
        if (err) {
            console.log(err);
            return;
        }
        console.log("DELETED CRAP SERVERS: " + result.affectedRows);
        setTimeout(deleteCrapServers, 1000 * 1 * 60);
    });
}
