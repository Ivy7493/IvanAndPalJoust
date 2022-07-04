import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';  

@Injectable({
	providedIn: 'root'
})
export class SocketService {
	constructor(private socket: Socket) { }

	// emit event
	sendPlaying(playing: boolean) {
		this.socket.emit("playing", playing);
	} 

	// listen event
	onFetchThreshhold() { // getting the threshold
		return this.socket.fromEvent('threshhold');
	}
}