(function() {

	if(!Animator.isSupported()){
		alert("no support for you!");
		return;
	}

	var galleryHolder = document.querySelector(".galleryExample");
	var gallery = galleryHolder.querySelector(".gallery .inner");
	var galleryImage = gallery.querySelector(".gallery-image");
	var controls = galleryHolder.querySelectorAll(".galleryExample .controls button");
	var status = galleryHolder.querySelector(".status");

	function setGalleryHeight() {
		Animator.setStyles(gallery.parentNode, { "min-height" : galleryImage.offsetHeight + "px" });
	}	

	window.addEventListener("resize", function() {
		setGalleryHeight();
	}, false);

	controls[0].addEventListener("click", function() {
		galleryStart();
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

	setGalleryHeight();

	function galleryStart() {
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