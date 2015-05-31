(function(){

	var socket = io();
	socket.on("userid", function(data) {
	    console.log("socket id", data);
	});

	var p1 = document.querySelector(".one");
	var p2 = document.querySelector(".two");
	var pTags = document.querySelectorAll("p");
	var pauseBtn = document.querySelector(".pause");
	var playBtn = document.querySelector(".play");

	pauseBtn.addEventListener("click", function() {
		Animator.pause();
	}, false);

	playBtn.addEventListener("click", function() {
		Animator.play();
	}, false);

	Animator.createTransition({
		elements : p1,
	    properties : ["font-size", "color"],
	    duration : ["2000ms", "1000ms"],
	    easing : "ease",
	    delay : ["500ms", "50ms"]
	});

	Animator.createTransition({
		elements : p2,
	    properties : ["font-size", "color"],
	    duration : ["500ms", "2000ms"],
	    easing : "ease",
	    delay : "0ms" 
	});

	Animator.addClass(pTags, ["someClass", "animated"]);
	Animator.createClass("test", { "font-family" : "Georgia", "font-weight" : "bold", "color" : "blue" });

	var rules1 = {};
	var rules2 = {};

	rules1[Animator.getPrefix("animation-duration")] = rules2[Animator.getPrefix("animation-duration")] = "4s";
	rules1[Animator.getPrefix("animation-delay")] = "0.5s";

	var sequence = Animator.combo([
		Animator.transition({
			element : p1,
			properties : ["color", "font-size"],
			setStyles : {
				before : {
					"color" : "red",
					"font-size" : "50px"
				}
			}
		}),
		Animator.transition({
			element : p2,
			properties : ["color", "font-size"],
			setStyles : {
				before : {
					"font-size" : "40px",
					"color" : "blue"
				}
			}
		})
	]);

	sequence
		.then(function(elements) {
			return Animator.combo([
				Animator.animation({
					element : p1,
					addClass : {
						before : "jello"
					},
					removeClass : {
						after : "jello"
					},
					setStyles : {
						before : rules1
					}
				}),
				Animator.animation({
					element : p2,
					addClass : {
						before : "flipOutY"
					},
					removeClass : {
						after : "flipOutY"
					},
					setStyles : {
						before : rules2
					}
				})
			])	
		})
		.then(function(elements) {
			return Animator.transition({
				element : pTags,
				properties : ["color", "font-size"],
				setStyles : {
					before : {
						"color" : "black",
						"font-size" : "20px"
					}
				}
			});
		})
		.then(function(elements) {
			return Animator.transition({
				element : pTags,
				properties : ["color", "font-size"],
				setStyles : {
					before : {
						"color" : "grey",
						"font-size" : "50px"
					}
				}
			});
		})
		.then(function(elements) {
			rules1[Animator.getPrefix("animation-duration")] = "";
			rules1[Animator.getPrefix("animation-delay")] = "";
			return Animator.animation({
				element : pTags,
				addClass : {
					before : "tada"
				},
				removeClass : {
					after : "tada"
				},
				setStyles : {
					before : rules1
				}
			});
		})
		.then(function() {
			console.log("finished!");
		})
		.catch(function() {
			console.log("STOP!!!");
		});

	// var sequence = Animator.combo([
	// 	Animator.animation({
	// 		element : p1,
	// 		addClass : {
	// 			before : "jello"
	// 		},
	// 		removeClass : {
	// 			after : "jello"
	// 		},
	// 		setStyles : {
	// 			before : rules1
	// 		}
	// 	}),
	// 	Animator.animation({
	// 		element : p2,
	// 		addClass : {
	// 			before : "flipOutY"
	// 		},
	// 		removeClass : {
	// 			after : "flipOutY"
	// 		},
	// 		setStyles : {
	// 			before : rules2
	// 		}
	// 	})
	// ]);

	// sequence
	// 	.then(function() {
	// 		console.log("Done!");
	// 	})	
	// 	.catch(function() {
	// 		console.log("STOP");
	// 	});

})();