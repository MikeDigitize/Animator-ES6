import * as math from './module1';
import * as promises from './promises';
import { getPrefixes as get } from './prefixes';

window.Animator = (function() {

	var socket = io();
	var letsDoMaths = {};

	console.log(get);

	// socket.on("userid", function(data) {
	//     console.log("socket id", data);
	// });
	
	letsDoMaths.math = math;
	letsDoMaths.promises = promises;

	return {
		letsDoMaths : letsDoMaths
	};


})();