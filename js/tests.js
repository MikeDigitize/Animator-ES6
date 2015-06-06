(function(){

	var socket = io();
	socket.on("userid", function(data) {
	    console.log("socket id", data);
	});

	if(!Animator.isSupported()){
		alert("no support for you!");
		return;
	}

	var pause = document.querySelector(".pause");
	var play = document.querySelector(".play");

	pause.addEventListener("click", function() {
		Animator.pause();
	}, false);

	play.addEventListener("click", function() {
		Animator.play();
	}, false);   

	var p = document.querySelectorAll(".text");



/**
  * Assign the transition to a variable so we can chain 
  */

	var sequence = Animator.combo([
		Animator.transition({
		    element : p,
		    properties : Animator.getPrefix("transform"),
		    addClass : {
		        before : "tran"
		    }
		}),
		Animator.animation({
            element : p,
            addClass : {
                before : "anim"
            }
        })
	]);    

	sequence
	    .then(function() {
	    	return Animator.transition({
			    element : p,
			    properties : Animator.getPrefix("transform"),
			    removeClass : {
			        before : "tran"
			    }
			})
	    })
	    .then(function() {
	    	console.log("done");
	    })
	    .catch(function() {
	        // handle errors here!
	    });

	// var p1 = document.querySelector(".one");
	// var p2 = document.querySelector(".two");
	// var pTags = document.querySelectorAll("p");
	// var pauseBtn = document.querySelector(".pause");
	// var playBtn = document.querySelector(".play");

	// pauseBtn.addEventListener("click", function() {
	// 	Animator.pause();
	// }, false);

	// playBtn.addEventListener("click", function() {
	// 	Animator.play();
	// }, false);

	// Animator.createTransition({
	// 	element : p1,
	//     properties : ["font-size", "color"],
	//     duration : ["2000ms", "1000ms"],
	//     easing : "ease",
	//     delay : ["500ms", "50ms"]
	// });

	// Animator.createTransition({
	// 	element : p2,
	//     properties : ["font-size", "color"],
	//     duration : ["500ms", "2000ms"],
	//     easing : "ease",
	//     delay : "0ms" 
	// });

	// Animator.addClass(pTags, ["someClass", "animated"]);
	// Animator.createClass("test", { "font-family" : "Georgia", "font-weight" : "bold", "color" : "blue" });

	// var rules = {};
	// var rules1 = {};
	// var rules2 = {};

	// rules[Animator.getPrefix("animation-name")] = "myAnimation";
	// rules[Animator.getPrefix("animation-duration")] = "2s";
	// rules[Animator.getPrefix("animation-iteration-count")] = 5;

	// rules1[Animator.getPrefix("animation-duration")] = rules2[Animator.getPrefix("animation-duration")] = "4s";
	// rules1[Animator.getPrefix("animation-delay")] = "0.5s";

	// Animator.createAnimation({
	// 	name : "myAnimation",
	// 	animation : { 
	// 		"0%" : { "font-size" : "100px", "color" : "red" }, 
	// 		"50%" : { "font-size" : "50px", "color" : "blue" },
	// 		"100%" : { "font-size" : "10px", "color" : "green" }
	// 	},
	// 	animationClass : {
	// 		name : "myAnimation",
	// 		rules : rules
	// 	}
	// });

	// var sequence = Animator.combo([
	// 	Animator.transition({
	// 		element : p1,
	// 		properties : ["color", "font-size"],
	// 		setStyles : {
	// 			before : {
	// 				"color" : "red",
	// 				"font-size" : "50px"
	// 			}
	// 		}
	// 	}),
	// 	Animator.transition({
	// 		element : p2,
	// 		properties : ["color", "font-size"],
	// 		setStyles : {
	// 			before : {
	// 				"font-size" : "40px",
	// 				"color" : "blue"
	// 			}
	// 		}
	// 	})
	// ]);

	// sequence
	// 	.then(function(elements) {
	// 		return Animator.combo([
	// 			Animator.animation({
	// 				element : p1,
	// 				addClass : {
	// 					before : "jello"
	// 				},
	// 				removeClass : {
	// 					after : "jello"
	// 				},
	// 				setStyles : {
	// 					before : rules1
	// 				}
	// 			}),
	// 			Animator.animation({
	// 				element : p2,
	// 				addClass : {
	// 					before : "flipOutY"
	// 				},
	// 				removeClass : {
	// 					after : "flipOutY"
	// 				},
	// 				setStyles : {
	// 					before : rules2
	// 				}
	// 			})
	// 		])	
	// 	})
	// 	.then(function(elements) {
	// 		return Animator.transition({
	// 			element : pTags,
	// 			properties : ["color", "font-size"],
	// 			setStyles : {
	// 				before : {
	// 					"color" : "black",
	// 					"font-size" : "20px"
	// 				}
	// 			}
	// 		});
	// 	})
	// 	.then(function(elements) {
	// 		return Animator.transition({
	// 			element : pTags,
	// 			properties : ["color", "font-size"],
	// 			setStyles : {
	// 				before : {
	// 					"color" : "grey",
	// 					"font-size" : "50px"
	// 				}
	// 			}
	// 		});
	// 	})
	// 	.then(function(elements) {
	// 		rules1[Animator.getPrefix("animation-duration")] = "";
	// 		rules1[Animator.getPrefix("animation-delay")] = "";
	// 		return Animator.animation({
	// 			element : pTags,
	// 			addClass : {
	// 				before : "tada"
	// 			},
	// 			removeClass : {
	// 				after : "tada"
	// 			},
	// 			setStyles : {
	// 				before : rules1
	// 			}
	// 		});
	// 	})
	// 	.then(function() {
	// 		console.log("finished!");
	// 	})
	// 	.catch(function() {
	// 		console.log("STOP!!!");
	// 	});

	// var sequence = Animator.combo([
	// 	Animator.transition({
	// 		element : p1,
	// 		properties : ["color", "font-size"],
	// 		addClass : {
	// 			before : "transition"
	// 		}
	// 	}),
	// 	Animator.transition({
	// 		element : p2,
	// 		properties : ["color", "font-size"],
	// 		addClass : {
	// 			before : "transition2"
	// 		}
	// 	})
	// ]);

	// sequence
	// 	.then(function() {
	// 		return Animator.combo([
	// 			Animator.transition({
	// 				element : p1,
	// 				properties : "font-size",
	// 				addClass : {
	// 					before : "transition3"
	// 				}
	// 			}),
	// 			Animator.transition({
	// 				element : p2,
	// 				properties : "font-size",
	// 				addClass : {
	// 					before : "transition4"
	// 				}
	// 			})
	// 		]);
	// 	})
	// 	.then(function() {
	// 		return Animator.combo([
	// 			Animator.transition({
	// 				element : p1,
	// 				properties : "font-size",
	// 				setStyles : {
	// 					before : {
	// 						"font-size" : "20px"
	// 					}
	// 				}
	// 			}),
	// 			Animator.transition({
	// 				element : p2,
	// 				properties : "font-size",
	// 				setStyles : {
	// 					before : {
	// 						"font-size" : "20px"
	// 					}
	// 				}
	// 			})
	// 		]);
	// 	})
	// 	.then(function() {
	// 		return Animator.animation({
	// 			element : pTags,
	// 			addClass : {
	// 				before : "myAnimation"
	// 			}
	// 		})
	// 	})
	// 	.then(function() {
	// 		console.log("done!");
	// 	});



})();