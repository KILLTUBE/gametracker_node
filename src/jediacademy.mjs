
// standalone script for jedi academy testing
// just call like: node jediacademy.js
dgram = require("dgram");
master = dgram.createSocket("udp4");
master.on("message", function(msg, rinfo) {
  //var ip = rinfo.address;
  //var port = rinfo.port;
  ip = rinfo.address;
  port = rinfo.port;
  response = msg.toString("binary");
  expectHeader = "\xFF\xFF\xFF\xFFgetserversResponse\x0A\x00";
  expectFootA = "\\EOT";
  expectFootB = "\\EOF";
  /*
  if (expectHeader == response.substr(0,expectHeader.length))
    console.log("header looks good!");
  if (expectFootA == response.substr(-expectFootA.length))
    console.log("expectFootA looks good");
  if (expectFootB == response.substr(-expectFootB.length))
    console.log("expectFootB looks good");
  */
  // lol, all this cutting..... doesnt need it
  //ips = response.substr(expectHeader.length); // cut the front
  //ips = ips.substr(0, ips.length-expectFootA.length); // cut the back
  start = expectHeader.length;
  end = response.length - expectFootA.length;
  // format is: /iiiipp -->> 1 slash, 4 bytes ip, 2 bytes port
  count = 0;
  for (var i=start; i<end; i+=7) {
    a = response.charCodeAt(i+1);
    b = response.charCodeAt(i+2);
    c = response.charCodeAt(i+3);
    d = response.charCodeAt(i+4);
    ip = a+"."+b+"."+c+"."+d;
    port = 1337;
    // real-binary(\xFF) to dec
    portA = strpadLeftOneZero(response.charCodeAt(i+5).toString(16));
    portB = strpadLeftOneZero(response.charCodeAt(i+6).toString(16));
    port = parseInt(portA + portB, 16);
    //console.log(ip + ":" + port);
    count++;
    /*
    // IF I REPLACE it with normal comment, the whole comment closes = fail
    mysql.query("  \
        INSERT IGNORE INTO  \
          servers_asd_debug (ip, port, time_added)  \
        VALUES  \
          (?, ?, ?)  \
    ", [ip, port, now()], function(err, result, fields){
      if (err)
      {
        console.log(err);
        return;
      }
      
      //console.log("QUERY DONE");
    });
    */
    console.log(ip, port);
  }
  /*
  expected = response.length - (expectHeader.length + expectFootA.length);
  expected /= 7;
  //END count=111 expected=111
  console.log("END count="+count + " expected="+expected + "\n");
  */
  console.log("ADD SERVER: " + count);
  //console.log("on.data: " + rinfo.address + ":" + rinfo.port + ": " + binary_escape(response));
  /*
  codes = "";
  for (var i=0; i<response.length; i++)
    codes += response.charCodeAt(i) + ",";
  console.log(codes);
  */
  return;
  // dont use ip/port in the mysql-callback, that fails, because its wrong context,
  // BUT it works, if i write: var ip=... and i dont know why
  //console.log(rinfo.address + ":" + rinfo.port + "= all fine for " + ip + ":" + port);
});
master.on("error", function(err){
  console.log("UDP-Socket: ERROR! " + err);
});
master.on("close", function(){
  console.log("UDP-Socket: CLOSE!");
});
master.on("listening", function(){
  console.log("UDP-Socket: LISTENING!");
});
master.on("end", function(){
  console.log("UDP-Socket: END!");
});
function strpadLeftOneZero(str)
{
    if (str.length == 0)
        return "00";
    if (str.length == 1)
        return "0" + str;
    return str;
}
function newBufferBinary(str) {
  buf = new Buffer(str.length);
  for (var i=0; i<str.length; i++)
    buf[i] = str.charCodeAt(i);
  return buf;
}
function queryUDP(ip, port, id) {
  var message = newBufferBinary("\xFF\xFF\xFF\xFFgetservers " + id + " full empty");
  master.send(message, 0, message.length, port, ip, function(err, bytes) {
    //console.log("master.send: test bytes="+bytes + "err=" + err);
    //console.log("master.send: " + message + " ");
  });
}
//queryUDP("cod2master.activision.com", 20710, 115); // cod2 1.0
queryUDP("masterjk3.ravensoft.com", 29060, 26);
