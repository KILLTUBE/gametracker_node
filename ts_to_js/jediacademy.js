dgram = require("dgram");
master = dgram.createSocket("udp4");
master.on("message", function (msg, rinfo) {
    ip = rinfo.address;
    port = rinfo.port;
    response = msg.toString("binary");
    expectHeader = "\xFF\xFF\xFF\xFFgetserversResponse\x0A\x00";
    expectFootA = "\\EOT";
    expectFootB = "\\EOF";
    start = expectHeader.length;
    end = response.length - expectFootA.length;
    count = 0;
    for (var i = start; i < end; i += 7) {
        a = response.charCodeAt(i + 1);
        b = response.charCodeAt(i + 2);
        c = response.charCodeAt(i + 3);
        d = response.charCodeAt(i + 4);
        ip = a + "." + b + "." + c + "." + d;
        port = 1337;
        portA = strpadLeftOneZero(response.charCodeAt(i + 5).toString(16));
        portB = strpadLeftOneZero(response.charCodeAt(i + 6).toString(16));
        port = parseInt(portA + portB, 16);
        count++;
        console.log(ip, port);
    }
    console.log("ADD SERVER: " + count);
    return;
});
master.on("error", function (err) {
    console.log("UDP-Socket: ERROR! " + err);
});
master.on("close", function () {
    console.log("UDP-Socket: CLOSE!");
});
master.on("listening", function () {
    console.log("UDP-Socket: LISTENING!");
});
master.on("end", function () {
    console.log("UDP-Socket: END!");
});
function strpadLeftOneZero(str) {
    if (str.length == 0)
        return "00";
    if (str.length == 1)
        return "0" + str;
    return str;
}
function newBufferBinary(str) {
    buf = new Buffer(str.length);
    for (var i = 0; i < str.length; i++)
        buf[i] = str.charCodeAt(i);
    return buf;
}
function queryUDP(ip, port, id) {
    var message = newBufferBinary("\xFF\xFF\xFF\xFFgetservers " + id + " full empty");
    master.send(message, 0, message.length, port, ip, function (err, bytes) {
    });
}
queryUDP("masterjk3.ravensoft.com", 29060, 26);
