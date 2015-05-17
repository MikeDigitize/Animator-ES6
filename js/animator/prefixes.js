class Prefix {
    
    constructor() {

        this.testElement = document.createElement("div");
        this.prefixes = new Map();
        
        /*
			Transforms
		*/

		this.prefixes.set("transform", ["-webkit-transform", "transform"]);
		this.prefixes.set("transform-origin", ["-webkit-transform-origin", "transform-origin"]);
		this.prefixes.set("transform-style", ["-webkit-transform-style", "transform-style"]);

		/*
			Transitions
		*/

		this.prefixes.set("transition", ["-webkit-transition", "transition"]);
		this.prefixes.set("transition-delay", ["-webkit-transition-delay", "transition-delay"]);
		this.prefixes.set("transition-duration", ["-webkit-transition-duration", "transition-duration"]);
		this.prefixes.set("transition-property", ["-webkit-transition-property", "transition-property"]);
		this.prefixes.set("transition-timing-function", ["-webkit-transition-timing-function", "transition-timing-function"]);

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