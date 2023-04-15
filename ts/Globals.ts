import { Connection } from "mysql";
import { Socket as SocketUDP} from "dgram";
export class Gameserver {
  lastUpdate: number;
  lastRequest: number;
  constructor() {
    this.lastUpdate = 0;
    this.lastRequest = 0;
  }
}
interface Gameservers {
  [ip: string]: {
    [port: number]: Gameserver;
  };
}
export class State {
  public static dgram: any;
  public static fs: any;
  public static mysql: Connection;
  public static gameservers: Gameservers;
  public static client: SocketUDP;
  public static master: SocketUDP;
  public static debug: boolean;
  public static message: Buffer;
}
