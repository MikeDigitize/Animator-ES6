import Prefix from "./prefixes";
import CssUtils from "./css-utils";
import * as promises from "./promises";
import DomUtils from "./dom-utils";
import Transition from "./transition-seq";

var socket = io();
socket.on("userid", function(data) {
    console.log("socket id", data);
});

class animator {
	
	constructor() {
		
	}

	getPrefix(prefix) {
		return new Prefix().getPrefix(prefix);
	}

	setStyles(element, styles) {
		return new CssUtils().setStyles(element, styles);
	}

	addClass(element, classList) {
		return new DomUtils().setClass(element, classList, false);
	}

	removeClass(element, classList) {
		return new DomUtils().setClass(element, classList, true);
	}

	transition(options) {
		return new Transition(options);
	}

} 

window.Animator = new animator();
var p = document.querySelector("p");

var sequence = Animator.transition({
		element : p,
		properties : ["font-size", "color"],
		addClass : {
			before : "transition" 
		}
	});
	sequence
		.then(function() {
			console.log("one done");
			return Animator.transition({
				element : p,
				properties : ["font-size", "color"],
				removeClass : {
					before : "transition"
				}
			});
		})
		.then(function() {
			console.log("two done");
			return Animator.transition({
				element : p,
				properties : ["font-size", "color"],
				addClass : {
					before : "transition"
				}
			});
		})
		.then(function() {
			console.log("three done");
			return Animator.transition({
				element : p,
				properties : ["font-size", "color"],
				removeClass : {
					before : "transition"
				}
			});
		})
		.then(function() {
			console.log("all done");
		});