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

		var isAnimating = false;
		var transform = Animator.getPrefix("transform");
		var duration = Animator.getPrefix("transition-duration");
		var ttf = Animator.getPrefix("transition-timing-function");

		logo.addEventListener("click", function () {
			if(!isAnimating) {
				startTankAnimation();
			}
		}, false);

		function startTankAnimation() {

			isAnimating = true;

			var sequence = Animator.transition({
				element : tank,
				properties : transform,
				setStyles : {
					before : Animator.createCSSRule(transform, "translate3d(13px,130px,0) rotate(12deg) scale(1)")
				}
			});

			sequence
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
					Animator.setStyles(tank, Animator.createCSSRule([duration, ttf], ["0.7s", "ease-out"]	));
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
					Animator.setStyles(tank, Animator.createCSSRule([duration, ttf], ["0.8s", "ease-out"]	));
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
					Animator.setStyles(tank, Animator.createCSSRule([duration, ttf], ["0.9s", "ease-out"]	));
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
					Animator.setStyles(tank, Animator.createCSSRule([duration, ttf], ["1s", "ease-out"]));
					return Animator.transition({
						element : tank,
						properties : transform,
						setStyles : {
							before : Animator.createCSSRule(transform, "translate3d(13px,130px,0) rotate(12deg) scale(0)")
						}
					});
				})
				.then(function (el) {
					console.log("done", el);
					isAnimating = false;
				});
		}



	})();


})();