/**
  * @Prefix Class
  *
  * @description Handles prefixing for CSS properties and DOM events.
  * @returns {Object}
  */

class Prefix {

   /**
     * @constructor function
     *
     * @description Creates a map that holds non-prefixed properties and event names as keys and associated prefixes as values to test against.
     */
    
    constructor() {

        this.testElement = document.createElement("div");
        this.prefixes = new Map();
        
        // Transforms
		this.prefixes.set("transform", ["-webkit-transform", "transform"]);
		this.prefixes.set("transform-origin", ["-webkit-transform-origin", "transform-origin"]);
		this.prefixes.set("transform-style", ["-webkit-transform-style", "transform-style"]);

		// Transitions
		this.prefixes.set("transition", ["-webkit-transition", "transition"]);
		this.prefixes.set("transition-delay", ["-webkit-transition-delay", "transition-delay"]);
		this.prefixes.set("transition-duration", ["-webkit-transition-duration", "transition-duration"]);
		this.prefixes.set("transition-property", ["-webkit-transition-property", "transition-property"]);
		this.prefixes.set("transition-timing-function", ["-webkit-transition-timing-function", "transition-timing-function"]);

		// Animations
		this.prefixes.set("keyframes", ["-webkit-", "-ms-", "-moz-", ""]);
		this.prefixes.set("animation", ["-webkit-animation", "-ms-animation", "-moz-animation", "animation"]);
		this.prefixes.set("animation-name", ["-webkit-animation-name", "-ms-animation-name", "-moz-animation-name", "animation-name"]);
		this.prefixes.set("animation-iteration-count", ["-webkit-animation-iteration-count", "-ms-animation-iteration-count", "-moz-animation-iteration-count", "animation-iteration-count"]);
		this.prefixes.set("animation-play-state", ["-webkit-animation-play-state", "-ms-animation-play-state", "-moz-animation-play-state", "animation-play-state"]);
		this.prefixes.set("animation-duration", ["-webkit-animation-duration", "-ms-animation-duration", "-moz-animation-duration", "animation-duration"]);
		this.prefixes.set("animation-delay", ["-webkit-animation-delay", "-ms-animation-delay", "-moz-animation-delay", "animation-delay"]);
		this.prefixes.set("animation-direction", ["-webkit-animation-direction", "-ms-animation-direction", "-moz-animation-direction", "animation-direction"]);
		this.prefixes.set("animation-fill-mode", ["-webkit-animation-fill-mode", "-ms-animation-fill-mode", "-moz-animation-fill-mode", "animation-fill-mode"]);

		// Transition / Animation end
		let WebkitTransition = "webkitTransitionEnd";
		let transition = "transitionend";
		let WebkitAnimation = "webkitAnimationEnd";
		let animation = "animationend";
		
		let transitionend = { WebkitTransition, transition };
		let animationend = { WebkitAnimation, animation };

		this.prefixes.set("transitionend", transitionend);
		this.prefixes.set("animationend", animationend); 

    }

   /**
     * @getPrefix function
     *
     * @params {String} The non-prefixed CSS property / DOM event name to search the prefix map for.
     * @description Handles prefix queries by searching and testing properties and values in the prefix map against a HTMLElement's CSSStyleDeclaration.
     * @returns {String} The queried prefix.
     * @global yes
     */

    getPrefix(prefix) {

		if(!this.prefixes.has(prefix)) {
			return false;
		}
		else if(prefix === "transitionend" || prefix === "animationend") {
			return this.getPrefixedEventName(prefix);
		}
		else if(prefix === "keyframes") {
			let keyframePrefix = this.prefixes.get(prefix).filter(f => this.testElement.style[f + "animation-name"] !== undefined)[0];
			return "@" + keyframePrefix + "keyframes";
		}
		else {
			return this.prefixes
				.get(prefix)
				.filter(f => this.testElement.style[f] !== undefined)[0];
		}

	}

   /**
     * @getPrefixedEventName function
     *
     * @params {String} The non-prefixed DOM event name to search the prefix map for.
     * @description Tests a HTMLElement's CSSStyleDeclaration for supported DOM event prefixes.
     * @returns {String} The queried prefix.
     * @global no
     */

	getPrefixedEventName(eventName) {

		let evtNames = this.prefixes.get(eventName);
		let matches = Object.keys(evtNames).filter(e => {
			return this.testElement.style[e] !== undefined;
		});
		return evtNames[matches[0]];

	}

};

export default Prefix;