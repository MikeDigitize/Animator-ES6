class Prefix {
    
    constructor() {

    	this.prefixes = new Map();
        this.testElement = document.createElement("div");

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

    }

    getPrefix(prefix) {

		if(!this.prefixes.has(prefix)) {
			return false;
		}
		else {
			return this.prefixes
				.get(prefix)
				.filter(f => this.testElement.style[f] !== undefined)[0];
		}

	}

};

export default Prefix;