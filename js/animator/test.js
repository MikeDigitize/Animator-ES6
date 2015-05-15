import * as math from './module1';
import * as promises from './promises';
//import { Prefixes as prefixes } from './prefixes';
import { test2 as prefixes } from './prefixes';

window.Animator = (function() {

	var socket = io();
	var letsDoMaths = {};

	// socket.on("userid", function(data) {
	//     console.log("socket id", data);
	// });
	
	letsDoMaths.math = math;
	letsDoMaths.promises = promises;

	console.log("hey", prefixes, prefixes.sayAge());

	// return {
	// 	letsDoMaths : letsDoMaths,
	// 	prefixes : new prefixes()
	// };

})();