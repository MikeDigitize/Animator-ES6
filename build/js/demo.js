(function(){

	var socket = io();
	socket.on("userid", function(data) {
	    console.log("socket id", data);
	});

	var p1 = document.querySelector(".one");
	var p2 = document.querySelector(".two");
	var pTags = document.querySelectorAll("p");
	var btn = document.querySelector(".stop");

	btn.addEventListener("click", function() {
		Animator.stop();
	}, false);

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

	var rules1 = {};
	var rules2 = {};

	rules1[Animator.getPrefix("animation-duration")] = rules2[Animator.getPrefix("animation-duration")] = "4s";
	rules1[Animator.getPrefix("animation-delay")] = "0.5s";

	var sequence = Animator.combo([
		Animator.transition({
			element : p1,
			properties : "color",
			setStyles : {
				before : {
					"color" : "red"
				}
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
			console.log("done!", elements);
		})
		.catch(function() {
			console.log("STOP!!!");
		});

})();