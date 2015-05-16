class Prefix {
    
    constructor() {

        this.testElement = document.createElement("div");
        this.prefixes = new Map();
        
        /*
			Transforms
		*/

		this.prefixes.set("transform", ["webkitTransform", "transform"]);
		this.prefixes.set("transform-origin", ["webkitTransformOrigin", "transformOrigin"]);
		this.prefixes.set("transform-style", ["webkitTransformStyle", "transformStyle"]);

		/*
			Transitions
		*/

		this.prefixes.set("transition", ["webkitTransition", "transition"]);
		this.prefixes.set("transition-delay", ["webkitTransitionDelay", "transitionDelay"]);
		this.prefixes.set("transition-duration", ["webkitTransitionDuration", "transitionDuration"]);
		this.prefixes.set("transition-property", ["webkitTransitionProperty", "transitionProperty"]);
		this.prefixes.set("transition-timing-function", ["webkitTransitionTimingFunction", "transitionTimingFunction"]);

		/*
			Transition / Animation end
		*/

		let WebkitTransition = "webkitTransitionEnd";
		let transition = "transitionend";
		let WebkitAnimation = "webkitAnimationEnd";
		let animation = "animationend";
		
		let transitionend = { WebkitTransition, transition };
		let animationend = { WebkitAnimation, animation };

		this.prefixes.set("transitionend", transitionend);
		this.prefixes.set("animationend", animationend);

    }

    getPrefix(prefix) {

		if(!this.prefixes.has(prefix)) {
			return false;
		}
		else if(prefix === "transitionend" || prefix === "animationend") {
			return this.getEventName(prefix);
		}
		else {
			return this.prefixes
				.get(prefix)
				.filter(f => this.testElement.style[f] !== undefined)[0];
		}

	}

	getEventName(evt) {

		let evtNames = this.prefixes.get(evt);
		let matches = Object.keys(evtNames).filter(e => {
			return this.testElement.style[e] !== undefined;
		});
		return evtNames[matches[0]];

	}

};

export default Prefix;