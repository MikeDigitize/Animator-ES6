import Prefix from "./prefixes";
import CssUtils from "./css-utils";
import DomUtils from "./dom-utils";
import Animation from "./animation-seq";
import Transition from "./transition-seq";
import Combo from "./combo-seq.js";

class animator { 
	
	constructor() {
		
	}

	getPrefix(prefix) {
		return new Prefix().getPrefix(prefix);
	}

	setStyles(element, styles) {
		return new CssUtils().setStyles(element, styles);
	}

	getStyles(element, properties) {
		return new CssUtils().getStyles(element, properties);
	}

	createTransition(transitions) {
		return new CssUtils().createTransition(transitions, new Prefix());
	}

	createClass(className, rules) {
		return new CssUtils().createClass(className, rules);
	}

	addClass(element, classList) {
		return new DomUtils().setClass(element, classList, true);
	}

	removeClass(element, classList) {
		return new DomUtils().setClass(element, classList, false);
	}

	transition(options) {
		return new Transition(options, new DomUtils(), new Prefix(), new CssUtils());
	}

	animation(options) {
		return new Animation(options, new DomUtils(), new Prefix());
	}

	combo(animations) {
		return new Combo(animations);
	}

}

window.Animator = new animator(); 