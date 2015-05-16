import * as math from './module1';
import * as promises from './promises';
import Prefix from './prefixes';

var socket = io();
socket.on("userid", function(data) {
    console.log("socket id", data);
});

var prefixes = new Prefix();
console.log(prefixes.getPrefix("transition"));

class animator {
	
	constructor() {
		
	}

	getPrefix(prefix) {
		return prefixes.getPrefix(prefix);
	}

} 

window.Animator = new animator();