(function(){

	var socket = io();
	socket.on("userid", function(data) {
	    console.log("socket id", data);
	});

	var p1 = document.querySelector(".one");
	var p2 = document.querySelector(".two");

	var pTags = document.querySelectorAll("p");

	Animator.createTransition({
		elements : p1,
	    properties : ["font-size", "color"],
	    duration : ["1000ms", "1000ms"],
	    easing : "ease",
	    delay : ["500ms", "50ms"]
	});

	Animator.createTransition({
		elements : p2,
	    properties : ["font-size", "color"],
	    duration : ["500ms", "1000ms"],
	    easing : "ease",
	    delay : "0ms" 
	});

	Animator.addClass(pTags, ["someClass", "animated"]);

	Animator.createClass("test", { "font-family" : "Georgia", "font-weight" : "bold", "color" : "blue" });

	// var sequence = Animator.combo([
	// 	Animator.transition({
	// 		element : pTags,
	// 		properties : "color",
	// 		setStyles : {
	// 			before : {
	// 				"color" : "red"
	// 			}
	// 		}
	// 	}),
	// 	Animator.transition({
	// 		element : pTags,
	// 		properties : "font-size",
	// 		setStyles : {
	// 			before : {
	// 				"font-size" : "40px"
	// 			}
	// 		}
	// 	})
	// ]);

	// var sequence = Animator.transition({
	// 	element : p1,
	// 	properties : ["font-size", "color"],
	// 	addClass : {
	// 		before : "transition" 
	// 	}
	// });

	// var sequence = Animator.animation({
	// 	element : pTags,
	// 	addClass : {
	// 		before : ["animated", "jello"] 
	// 	},
	// 	removeClass : {
	// 		before : "someClass",
	// 		after : "jello"
	// 	}
	// });

	// var sequence = Animator.combo([
	// 	Animator.animation({
	// 		element : pTags,
	// 		addClass : {
	// 			before : ["animated", "jello"] 
	// 		}
	// 	}),
	// 	Animator.transition({
	// 		element : pTags,
	// 		properties : ["font-size", "color"],
	// 		addClass : {
	// 			before : "transition",
	// 			after : "test" 
	// 		}
	// 	})
	// ]);

	var sequence = Animator.combo([
		Animator.animation({
			element : pTags,
			addClass : {
				before : "jello"
			},
			removeClass : {
				after : "jello"
			}
		}),
		Animator.animation({
			element : pTags,
			addClass : {
				before : "flipOutY"
			},
			removeClass : {
				after : "flipOutY"
			}
		})
	]);

	sequence
		.then(function() {
			return Animator.transition({
				element : p1,
				properties : ["font-size", "color"],
				addClass : {
					before : "transition",
					after : "test" 
				}
			})
		})
		.then(function(elements) {
			return Animator.animation({
				element : pTags,
				addClass : {
					before : "flipInY"
				},
				removeClass : {
					after : "flipInY"
				}
			})			
		})
		.then(function(elements) {
			console.log("done!", elements);
		});

})();