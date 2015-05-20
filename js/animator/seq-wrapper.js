import Animation from "./animation-seq";
import Transition from "./transition-seq";

class SequenceWrapper() {
	constructor(options, domUtils, prefix, cssutils, promise, type) {

		this.options = options;
		this.domUtils = domUtils;
		this.prefix = prefix;
		this.cssutils = cssutils;
		this.promise = promise;

		if(options.element.length) {
			if(type === "transition") {
				createTransitionWrapper();
			}
			else {
				createAnimationWrapper();
			} 
		}
		else {
			if(type === "transition") {
				return new Transition(options, domUtils, prefix, cssutils, promise);
			}
			else {
				return new Animation(options, domUtils, prefix, cssutils, promise);
			} 
		}

	}

	createTransitionWrapper() {

	}

	createAnimationWrapper() {

	}
}