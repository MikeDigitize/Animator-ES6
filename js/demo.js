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

	Animator.createClass("test", { "font-family" : "Georgia", "font-weight" : "bold", "color" : "blue" });

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
	sequence
		.then(function(elements) {
			Animator.addClass(elements[0], "test");
			setTimeout(function(){
				Animator.deleteClass("test");
			}, 1000);
			console.log("done!", elements);
		});

})();