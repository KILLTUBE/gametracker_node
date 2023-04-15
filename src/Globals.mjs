//import { Connection         } from "mysql";
import { Socket as SocketUDP} from "dgram";
export class Gameserver {
  lastUpdate = 0;
  lastRequest = 0;
}
/**
 * An object containing the Gameserver objects indexed by IP and port
 *
 * @typedef {{[ip: string]: {[port: number]: Gameserver}}} Gameservers
 */
export class State {
  /** @type {any} */
  static dgram;
  /** @type {any} */
  static fs;
  /** @type {Connection} */
  static mysql;
  /** @type {Gameservers} */
  static gameservers = {};
  /** @type {SocketUDP} */
  static client;
  /** @type {SocketUDP} */
  static master;
  static debug = false;
  /** @type {Buffer} */
  static message;
}
