(function(){

	var socket = io();
	socket.on("userid", function(data) {
	    console.log("socket id", data);
	});

	if(!Animator.isSupported()){
		alert("no support for you!");
		return;
	}

	(function () {

		var holder = document.querySelector(".top-header");
		var logo = holder.querySelector(".logo");
		var tank = logo.querySelector(".tank");
		var title = holder.querySelector("h1");
		var text = document.querySelector(".coming-soon");
		var isAnimating = false;
		var transform = Animator.getPrefix("transform");
		var duration = Animator.getPrefix("transition-duration");
		var ttf = Animator.getPrefix("transition-timing-function");

		Animator.setStyles(title, Animator.createCSSRule([transform, "opacity"], ["scale(1)", 0]));
		Animator.createTransition({
			element : title,
			properties : transform,
			duration : "0.5s",
			easing : "ease-in-out"
		});
		Animator.createTransition({
			element : text,
			properties : "opacity",
			duration : "1s",
			easing : "ease-in"
		});

		function startAnimation() {

			isAnimating = true;

			var sequence = Animator.animation({
				element : logo,
				addClass : {
					before : ["animated", "bounceInLeft"]
				}
			});

			sequence
				.then(function() {
					return Animator.transition({
						element : tank,
						properties : transform,
						setStyles : {
							before : Animator.createCSSRule(transform, "translate3d(13px,130px,0) rotate(12deg) scale(1)")
						}
					});
				})
				.then(function () {
					return Animator.transition({
						element : tank,
						properties : transform,
						setStyles : {
							before : Animator.createCSSRule(transform, "translate3d(43px,-15px,0) rotate(17deg)")
						}
					});
				})
				.then(function () {
					Animator.setStyles(tank, Animator.createCSSRule([duration, ttf],	["0.4s", "cubic-bezier(0.175, 0.885, 0.320, 1)"]));
					return Animator.transition({
						element : tank,
						properties : transform,
						setStyles : {
							before : Animator.createCSSRule(transform, "translate3d(43px,-15px,0) rotate(90deg)")
						}
					});
				})
				.then(function () {
					Animator.setStyles(tank, Animator.createCSSRule([duration, ttf], ["0.3s", "ease-out"]	));
					return Animator.transition({
						element : tank,
						properties : transform,
						setStyles : {
							before : Animator.createCSSRule(transform, "translate3d(90px,-15px,0) rotate(90deg)")
						}
					});
				})
				.then(function () {
					Animator.setStyles(tank, Animator.createCSSRule([	duration, ttf], ["0.4s", "cubic-bezier(0.175, 0.885, 0.320, 1)"]));
					return Animator.transition({
						element : tank,
						properties : transform,
						setStyles : {
							before : Animator.createCSSRule(transform, "translate3d(95px,-15px,0) rotate(168deg)")
						}
					});
				})
				.then(function (tank) {
					Animator.setStyles(tank, Animator.createCSSRule([duration, ttf], ["0.3s", "ease-out"]	));
					return Animator.transition({
						element : tank,
						properties : transform,
						setStyles : {
							before : Animator.createCSSRule(transform, "translate3d(120px,132px,0) rotate(168deg)")
						}
					});
				})
				.then(function () {
					Animator.setStyles(tank, Animator.createCSSRule([duration, ttf], ["0.3s", "cubic-bezier(0.175, 0.885, 0.320, 1)"]	));
					return Animator.transition({
						element : tank,
						properties : transform,
						setStyles : {
							before : Animator.createCSSRule(transform, "translate3d(120px,132px,0) rotate(270deg)")
						}
					});
				})
				.then(function () {
					Animator.setStyles(tank, Animator.createCSSRule([duration, ttf], ["0.3s", "ease-out"]	));
					return Animator.transition({
						element : tank,
						properties : transform,
						setStyles : {
							before : Animator.createCSSRule(transform, "translate3d(13px,130px,0) rotate(270deg)")
						}
					});
				})
				.then(function () {
					Animator.setStyles(tank, Animator.createCSSRule([duration, ttf], ["0.3s", "cubic-bezier(0.175, 0.885, 0.320, 1)"]	));
					return Animator.transition({
						element : tank,
						properties : transform,
						setStyles : {
							before : Animator.createCSSRule(transform, "translate3d(13px,130px,0) rotate(12deg) scale(1)")
						}
					});
				})
				.then(function () {
					Animator.setStyles(tank, Animator.createCSSRule([duration, ttf], ["0.3s", "ease-out"]));
					return Animator.transition({
						element : tank,
						properties : transform,
						setStyles : {
							before : Animator.createCSSRule(transform, "translate3d(13px,130px,0) rotate(12deg) scale(0)")
						}
					});
				})
				.then(function() {
					return Animator.animation({
						element : title,
						setStyles : {
							before : {
								opacity : 1
							}
						},
						addClass : {
							before : ["animated", "zoomInRight"]
						},
						removeClass : {
							after : "zoomInRight"
						}
					});
				})
				.then(function () {
					return Animator.transition({
						element : title,
						setStyles : {
							before : Animator.createCSSRule(transform, "scale(0.1)")
						}
					});
				})
				.then(function () {
					Animator.setStyles(title, Animator.createCSSRule([duration, ttf, "text-transform"], ["0.2s", "cubic-bezier(0.175, 0.885, 0.320, 1)", "uppercase"]));
					return Animator.transition({
						element : title,
						setStyles : {
							before : Animator.createCSSRule(transform, "scale(5)")
						}
					});
				})
				.then(function () {
					return Animator.transition({
						element : title,
						setStyles : {
							before : Animator.createCSSRule(transform, "scale(1)")
						}
					});
				})
				.then(function () {
					Animator.setStyles(text, { opacity : 1 });
					return Animator.combo([
						Animator.animation({
							element : text,
							addClass : {
								before : ["animated", "slideInUp"]
							}
						}),
						Animator.transition({
							element : text,
							properties : "opacity",
							setStyles : {
								before : {
									opacity : 1
								}
							}
						})
					]);
				})
				.then(function() {
					console.log("done");
					isAnimating = false;
				});
		}

		startAnimation();

	})();


})();