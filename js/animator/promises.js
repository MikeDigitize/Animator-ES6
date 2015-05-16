import { Promise as p } from './es6-promise.js';

let Promise = p;
let text = document.querySelector("p");

let sequence = new Promise(function(resolve, reject) {

	setTimeout(function() {
		text.innerHTML = "First promise...";
		resolve("hi");
	}, 1000);

});

sequence.then(function(msg) {
	
	return new Promise(function(resolve, reject) {

		let random = Math.floor(Math.random() * 5) + 1;
		console.log("random", random);
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