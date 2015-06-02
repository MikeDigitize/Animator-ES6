(function() {

	if(!Animator.isSupported()){
		alert("no support for you!");
		return;
	}

	var gallery = document.querySelector(".gallery .inner");

	gallery.addEventListener("mouseover", function() {
		Animator.pause();
	}, false);

	gallery.addEventListener("mouseout", function() {
		Animator.play();
	}, false);

	(function galleryStart() {
		var galleryRules = {}, sequence;
		galleryRules[Animator.getPrefix("animation")] = "bounce 3s 6, galleryAnimation 9s 2";

		Animator.createAnimation({
			name : "galleryAnimation",
			animation : { 
				"0%" : { "left" : "0%" }, 
				"25%" : { "left" : "0%"},
				"33%" : { "left" : "-100%"},
				"58%" : { "left" : "-100%" },
				"66%" : { "left" : "-200%" },
				"92%" : { "left" : "-200%" },
				"100%" : { "left" : "0%" }
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
			.then(function(element) {
				Animator.removeClass(element, "galleryAnimation");
				Animator.deleteClass("galleryAnimation");
				galleryRules[Animator.getPrefix("animation")] = "tada 1s 1";
				Animator.createClass("galleryAnimation", galleryRules);
				return Animator.animation({
					element : gallery,
					addClass : {
						before : "galleryAnimation"
					}
				});
			})
			.then(function() {
				console.log("all done!");
				//galleryStart();
			})
			.catch(function() {
				console.log("error!")
			});
	})();	

})();