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
		ninjaRules[Animator.getPrefix("animation")] = "ninjaAnimation 0.3s 6";
		ninjaBackgroundRules[Animator.getPrefix("animation")] = "ninjaBackgroundAnimation 6s 1";
		ninjaBushRules[Animator.getPrefix("animation")] = "ninjaBushAnimation 3s 1";

		Animator.createAnimation({
			name : "ninjaAnimation",
			animation : { 
				"0%, 24.9%, 100%" : { "background-position" : "0px" }, 
				"25%, 49.9%" : { "background-position" : "-250px" },
				"50%, 74.9%" : { "background-position" : "-500px" },
				"75%, 99%" : { "background-position" : "-750px" }
			},
			animationClass : {
				name : "ninjaAnimation",
				rules : ninjaRules
			}
		});	

		Animator.createAnimation({
			name : "ninjaBackgroundAnimation",
			animation : { 
				"0%" : { "background-position" : "0px -350px" },
				"90%" : { "background-position" : "-200px -350px" },
				"100%" : { "background-position" : "0px -350px" }
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
				"90%" : { "background-position" : "90%" },
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
			.then(function() {
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

/**
 * Text Transition Example
 */

(function() {

	var textHolder = document.querySelector(".textExample");
	var title = textHolder.querySelector(".title");
	var text = title.querySelectorAll("span");
	var controls = textHolder.querySelectorAll(".controls button");
	var status = textHolder.querySelector(".status");
	var rules = {}, sequence;

	controls[0].removeAttribute("disabled");

	function animateLetter() {

		var count = -1, total = text.length, seq;

		return new Promise(function(resolve, reject) {

			function check() {
				count++;
				if(count === total) {
					seq = Animator.transition({
						element : title,
						properties : Animator.getPrefix("transform"),
						addClass : {
							before : "textStep3"
						},
						removeClass : {
							after : "textStep3"
						}
					});
					seq
						.then(function() {
							resolve();		
						});					
				}
				else {
					seq = Animator.transition({
						element : text[count],
						properties : Animator.getPrefix("transform"),
						addClass : {
							before : "textStep1"
						},
						removeClass : {
							after : "textStep1"
						}
					});
					seq
						.then(function(element) {
							return Animator.transition({
								element : element,
								properties : [Animator.getPrefix("transform"), "opacity"],
								addClass : {
									before : "textStep2"
								},
								removeClass : {
									after : "textStep2"
								}
							});
						})
						.then(function() {
							check();
						});
				}
			}
			
			check();

		});
	}

	controls[0].addEventListener("click", function() {
		this.setAttribute("disabled", "disabled");
		controls[1].removeAttribute("disabled");
		sequence = animateLetter();
		sequence
			.then(function() {
				controls[0].removeAttribute("disabled");
				controls[1].setAttribute("disabled", "disabled");
				controls[2].setAttribute("disabled", "disabled");
				status.innerHTML = "finished";
			})
			.catch(function() {
				console.log("whoops!");
			})
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

	Animator.createTransition({
		elements : text,
	    properties : [Animator.getPrefix("transform"), "opacity"],
	    duration : ["75ms", "100ms"]
	});

	Animator.createTransition({
		elements : title,
	    properties : Animator.getPrefix("transform"),
	    easing : ["ease-in"],
	    duration : "250ms"
	});

	rules[Animator.getPrefix("transform")] = "scale(2)";
	Animator.createClass("textStep1", rules);

	rules[Animator.getPrefix("transform")] = "scale(0.75)";
	rules.opacity = "0 !important";
	Animator.createClass("textStep2", rules);

	rules[Animator.getPrefix("transform")] = "scale(200)";
	rules[Animator.getPrefix("transition-duration")] = "750ms !important";
	rules.opacity = "1";
	Animator.createClass("textStep3", rules);

})();


/**
  *	Loading Example
  */

(function() {

	var loadingHolder = document.querySelector(".loadingExample");
	var core = loadingHolder.querySelector(".cupcakeCore");
	var inner = loadingHolder.querySelector(".cupcakeInner");
	var controls = loadingHolder.querySelectorAll(".controls button");
	var status = loadingHolder.querySelector(".status");
	var coreRules = {}, innerRules = {}, animation = Animator.getPrefix("animation"), sequence;

	var adir = Animator.getPrefix("animation-direction"),
		atf = Animator.getPrefix("animation-timing-function"),
		adur = Animator.getPrefix("animation-duration"),
		an = Animator.getPrefix("animation-name"),
		aic = Animator.getPrefix("animation-iteration-count");

	coreRules[adur] = "500ms";
	innerRules[adur] = "1000ms";
	coreRules[adir] = innerRules[adir] = "alternate";
	coreRules[atf] = innerRules[atf] = "ease-in-out";
	coreRules[aic] = "10";
	innerRules[aic] = "5";
	coreRules[an] = innerRules[an] = "coreAnimate";

	Animator.createAnimation({
		name : "coreAnimate",
		animation : { 
			"to": { "height" : "90%", "width" : "90%" }
		}
	});	

	function playLoader() {

		sequence = Animator.combo([
			Animator.animation({
				element : core,
				setStyles : {
					before : coreRules
				}
			}),
			Animator.animation({
				element : inner,
				setStyles : {
					before : innerRules
				}
			})
		]);

		sequence
			.then(function() {
				controls[0].removeAttribute("disabled");
				controls[1].setAttribute("disabled", "disabled");
				controls[2].setAttribute("disabled", "disabled");
			})
			.catch(function() {
				console.log("whoops!");
			});

	}


	controls[0].addEventListener("click", function() {
		this.setAttribute("disabled", "disabled");
		controls[1].removeAttribute("disabled");
		playLoader();
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

})();