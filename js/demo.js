(function() {

	if(!Animator.isSupported()){
		alert("no support for you!");
		return;
	}

	var gallery = document.querySelector(".gallery .inner");
	var galleryRules = {}, sequence;

	gallery.addEventListener("mouseover", function() {
		Animator.pause();
	}, false);

	gallery.addEventListener("mouseout", function() {
		Animator.play();
	}, false);

	galleryRules[Animator.getPrefix("animation-name")] = "galleryAnimation";
	galleryRules[Animator.getPrefix("animation-duration")] = "8s";
	galleryRules[Animator.getPrefix("animation-iteration-count")] = 5;

	Animator.createAnimation({
		name : "galleryAnimation",
		animation : { 
			"0%" : { "transform" : "translate3d(0%, 0, 1px)" }, 
			"30%" : { "transform" : "translate3d(0%, 0, 1px)"},
			"50%" : { "transform" : "translate3d(-100%, 0, 1px)" },
			"80%" : { "transform" : "translate3d(-100%, 0, 1px)" },
			"100%" : { "transform" : "translate3d(0%, 0, 1px)" }
		},
		animationClass : {
			name : "galleryAnimation",
			rules : galleryRules
		}
	});

	sequence = Animator.animation({
		element : gallery,
		addClass : {
			before : "galleryAnimation"
		}
	});

	sequence
		.then(function() {
			console.log("all done!");
		})
		.catch(function() {
			console.log("error!")
		});

})();