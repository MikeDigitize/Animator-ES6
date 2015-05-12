import * as math from './module1';
import { Promise as p } from './es6-promise.js';

window.Animator = (function() {

	let Promise = p;

	var socket = io();

	// var arr = [1, 2, 3];
	// arr = arr.map( x => x * 2);
	// console.log("yo!", arr);

	var letsDoMaths = {};

	// socket.on("userid", function(data) {
	//     console.log("socket id", data);
	// });
	
	letsDoMaths.math = math;
	// console.log("letsDoMaths", letsDoMaths);

	var text = document.querySelector("p");

	// console.log('2π = ', letsDoMaths.math.sum(letsDoMaths.math.pi, letsDoMaths.math.pi));	

	var sequence = new Promise(function(resolve, reject) {

		setTimeout(function() {
			text.innerHTML = "First promise...";
			resolve("hi");
		}, 1000);

	});

	sequence.then(function(msg) {
		
		return new Promise(function(resolve, reject) {

			var random = Math.floor(Math.random() * 5) + 1;
			setTimeout(function() {

				if(random > 3) {
					console.log(random);
					resolve(msg);
				}
				else {
					console.log(random);
					reject(msg);
				}

			}, 1000);

		});

	})
	.then(function(msg) {
		text.innerHTML = "Second promise resolved!"
		console.log(msg);
	})
	.catch(function(e) {
		text.innerHTML = "Whoops! Second promise failed."
		console.log("whoops", e);
	});

	return {
		letsDoMaths : letsDoMaths
	};


})();