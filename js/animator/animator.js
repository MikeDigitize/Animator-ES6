import Prefix from "./prefixes";
import CssUtils from "./css-utils";
//import * as promises from "./promises";
import DomUtils from "./dom-utils";
import Transition from "./transition-seq";
import Combo from "./combo-seq.js";

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

	getStyles(element, properties) {
		return new CssUtils().getStyles(element, properties);
	}

	addClass(element, classList) {
		return new DomUtils().setClass(element, classList, false);
	}

	removeClass(element, classList) {
		return new DomUtils().setClass(element, classList, true);
	}

	createTransition(transitions) {
		return new CssUtils().createTransition(transitions);
	}

	transition(options) {
		return new Transition(options);
	}

	combo(animations) {
		return new Combo(animations);
	}

} 

window.Animator = new animator();
var p1 = document.querySelector(".one");
var p2 = document.querySelector(".two");

Animator.createTransition({
	elements : p1,
    properties : ["font-size", "color"],
    duration : ["1000ms", "1000ms"],
    easing : "ease",
    delay : ["500ms", "50ms"]
});

Animator.createTransition({
	elements : p2,
    properties : "font-size",
    duration : "500ms",
    easing : "ease",
    delay : "0ms"
});

var sequence = Animator.combo([
	Animator.transition({
		element : p1,
		properties : ["font-size", "color"],
		addClass : {
			before : "transition" 
		}
	}),
	Animator.transition({
		element : p2,
		properties : "font-size",
		setStyles : {
			before : {
				"font-size" : "40px"
			}
		}
	})
]);
// var sequence = Animator.transition({
// 	element : p2,
// 	properties : "font-size",
// 	setStyles : {
// 		before : {
// 			"font-size" : "40px"
// 		}
// 	}
// });

sequence
	.then(function(elements) {
		console.log("done!", elements);
	});

// var sequence = Animator.transition({
// 	element : p1,
// 	properties : ["font-size", "color"],
// 	addClass : {
// 		before : "transition" 
// 	},
// 	setStyles : {
// 		before : {
// 			"font-family" : "Arial"
// 		},
// 		after : {
// 			"font-weight" : "bold !important"
// 		}
// 	}
// });
// sequence
// 	.then(function(el) {
// 		console.log("one done");
// 		return Animator.transition({
// 			element : el,
// 			properties : ["font-size", "color"],
// 			removeClass : {
// 				before : "transition"
// 			},
// 			setStyles : {
// 				before : {
// 					"font-family" : "Georgia"
// 				},
// 				after : {
// 					"font-weight" : "normal !important"
// 				}
// 			}
// 		});
// 	})
// 	.then(function(el) {
// 		console.log("two done", el);
// 		return Animator.transition({
// 			element : el,
// 			properties : ["font-size", "color"],
// 			addClass : {
// 				before : "transition"
// 			},
// 			setStyles : {
// 				before : {
// 					"font-family" : "Trebuchet MS"
// 				},
// 				after : {
// 					"font-weight" : "bold !important"
// 				}
// 			}
// 		});
// 	})
// 	.then(function(el) {
// 		console.log("three done", el);
// 		return Animator.transition({
// 			element : el,
// 			properties : ["font-size", "color"],
// 			removeClass : {
// 				before : "transition"
// 			}
// 		});
// 	})
// 	.then(function(el) {
// 		console.log("all done", el);
// 	});