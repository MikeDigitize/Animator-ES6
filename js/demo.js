/**
 * Banner Example
 */

(function() {

	if(!Animator.isSupported()){
		alert("no support for you!");
		return;
	}

	var galleryHolder = document.querySelector(".bannerExample");
	var gallery = galleryHolder.querySelector(".banner .inner");
	var galleryImage = gallery.querySelector(".banner-image");
	var controls = galleryHolder.querySelectorAll(".controls button");
	var status = galleryHolder.querySelector(".status");

	function setBannerHeight() {
		Animator.setStyles(gallery.parentNode, { "min-height" : galleryImage.offsetHeight + "px" });
	}	

	window.addEventListener("resize", function() {
		setBannerHeight();
	}, false);

	controls[0].addEventListener("click", function() {
		bannerStart();
		this.setAttribute("disabled", "disabled");
		controls[1].removeAttribute("disabled");
		status.innerHTML = "playing";
	}, false);

	controls[1].setAttribute("disabled", "disabled");
	controls[1].addEventListener("click", function() {
		this.setAttribute("disabled", "disabled");
		controls[2].removeAttribute("disabled");
		Animator.pause();
		status.innerHTML = "paused";
	}, false);

	controls[2].setAttribute("disabled", "disabled");
	controls[2].addEventListener("click", function() {
		this.setAttribute("disabled", "disabled");
		controls[1].removeAttribute("disabled");
		Animator.play();
		status.innerHTML = "playing";
	}, false);

	setBannerHeight();

	function bannerStart() {
		var bannerRules = {}, sequence;
		bannerRules[Animator.getPrefix("animation")] = "bounce 3s 6, bannerAnimation 9s 2";

		Animator.createAnimation({
			name : "bannerAnimation",
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
				name : "bannerAnimation",
				rules : bannerRules
			}
		});	

		sequence = Animator.animation({
			element : gallery,
			addClass : {
				before : "bannerAnimation"
			}
		});

		sequence
			.then(function(element) {
				Animator.removeClass(element, "bannerAnimation");
				Animator.deleteClass("bannerAnimation");
				bannerRules[Animator.getPrefix("animation")] = "tada 1s 1";
				Animator.createClass("bannerAnimation", bannerRules);
				return Animator.animation({
					element : gallery,
					addClass : {
						before : "bannerAnimation"
					}
				});
			})
			.then(function() {
				status.innerHTML = "finished";
				controls[0].removeAttribute("disabled");
				controls[1].setAttribute("disabled", "disabled");
				controls[2].setAttribute("disabled", "disabled");
			})
			.catch(function() {
				console.log("error!")
			});
	}	

})();

/**
 * Sprite Animation Example
 */

(function() {

	if(!Animator.isSupported()){
		alert("no support for you!");
		return;
	}

	var spriteAnimationHolder = document.querySelector(".spriteAnimationExample");
	var ninja = spriteAnimationHolder.querySelector(".ninja");
	var ninjaBackground = spriteAnimationHolder.querySelector(".ninja-background");
	var ninjaBush = spriteAnimationHolder.querySelector(".ninja-bush");
	var controls = spriteAnimationHolder.querySelectorAll(".controls button");
	var status = spriteAnimationHolder.querySelector(".status");

	controls[0].addEventListener("click", function() {
		this.setAttribute("disabled", "disabled");
		controls[1].removeAttribute("disabled");
		ninjaStart();
		status.innerHTML = "playing";
	}, false);

	controls[1].setAttribute("disabled", "disabled");
	controls[1].addEventListener("click", function() {
		this.setAttribute("disabled", "disabled");
		controls[2].removeAttribute("disabled");
		Animator.pause();
		status.innerHTML = "paused";
	}, false);

	controls[2].setAttribute("disabled", "disabled");
	controls[2].addEventListener("click", function() {
		this.setAttribute("disabled", "disabled");
		controls[1].removeAttribute("disabled");
		Animator.play();
		status.innerHTML = "playing";
	}, false);

	function ninjaStart() {
		
		var ninjaRules = {}, ninjaBackgroundRules = {}, ninjaBushRules = {}, sequence;
		ninjaRules[Animator.getPrefix("animation")] = "ninjaAnimation 0.3s 7";
		ninjaBackgroundRules[Animator.getPrefix("animation")] = "ninjaBackgroundAnimation 9s 1";
		ninjaBushRules[Animator.getPrefix("animation")] = "ninjaBushAnimation 3s 1";

		Animator.createAnimation({
			name : "ninjaAnimation",
			animation : { 
				"0%" : { "background-position" : "0px" }, 
				"24.9%" : { "background-position" : "0px" },
				"25%" : { "background-position" : "-250px" },
				"49.9%" : { "background-position" : "-250px" },
				"50%" : { "background-position" : "-500px" },
				"74.9%" : { "background-position" : "-500px" },
				"75%" : { "background-position" : "-750px" },
				"99.9%" : { "background-position" : "-750px" },
				"100%" : { "background-position" : "0px" }
			},
			animationClass : {
				name : "ninjaAnimation",
				rules : ninjaRules
			}
		});	

		Animator.createAnimation({
			name : "ninjaBackgroundAnimation",
			animation : { 
				"0%" : { "background-position" : "0% -350px" },
				"99.9%" : { "background-position" : "25% -350px" },
				"100%" : { "background-position" : "0% -350px" }
			},
			animationClass : {
				name : "ninjaBackgroundAnimation",
				rules : ninjaBackgroundRules
			}
		});	

		Animator.createAnimation({
			name : "ninjaBushAnimation",
			animation : { 
				"0%" : { "background-position" : "0%" },
				"99.9%" : { "background-position" : "95%" },
				"100%" : { "background-position" : "0%" }
			},
			animationClass : {
				name : "ninjaBushAnimation",
				rules : ninjaBushRules
			}
		});	

		sequence = Animator.combo([
			Animator.animation({
				element : ninja,
				addClass : {
					before : "ninjaAnimation"
				}
			}),
			Animator.animation({
				element : ninjaBackground,
				addClass : {
					before : "ninjaBackgroundAnimation"
				}
			}),
			Animator.animation({
				element : ninjaBush,
				addClass : {
					before : "ninjaBushAnimation"
				}
			})
		])

		sequence
			.then(function(elements) {
				console.log(elements);
				status.innerHTML = "finished";
				Animator.removeClass(ninja, "ninjaAnimation");
				Animator.removeClass(ninjaBackground, "ninjaBackgroundAnimation");
				Animator.removeClass(ninjaBush, "ninjaBushAnimation");
				controls[0].removeAttribute("disabled");
				controls[1].setAttribute("disabled", "disabled");
				controls[2].setAttribute("disabled", "disabled");
			})
			.catch(function() {
				console.log("error!")
			});
	}	

})();