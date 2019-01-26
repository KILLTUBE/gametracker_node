import { Connection } from "mysql";
import { Socket } from "net";

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
		[port: string]: Gameserver;
	};
}

export class State {
	public static dgram: any;
	public static fs: any;
	public static mysql: Connection;
	public static gameservers: Gameservers;
	public static client: Socket;
	public static master: Socket;
	public static debug: boolean;
	
}