import Prefix from "./prefixes";
import CssUtils from "./css-utils";
import DomUtils from "./dom-utils";
import Animation from "./animation-seq";
import Transition from "./transition-seq";
import Combo from "./combo-seq";
import SequenceWrapper from "./seq-wrapper";
import { Promise as Promise } from "./es6-promise";

class animator { 
	
	constructor() {
		let style = document.createElement("style");
        style.appendChild(document.createTextNode(""));
        document.head.appendChild(style);
        this.stylesheet = style.sheet;
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
		return new CssUtils().createClass(className, rules, this.stylesheet);
	}

	deleteClass(className) {
		return new CssUtils().deleteClass(className, this.stylesheet);
	}

	addClass(element, classList) {
		return new DomUtils().setClass(element, classList, true);
	}

	removeClass(element, classList) {
		return new DomUtils().setClass(element, classList, false);
	}

	transition(options) {
		return new SequenceWrapper(options, DomUtils, Prefix, CssUtils, Promise, Transition, Combo);
	}

	animation(options) {
		return new Animation(options, DomUtils, Prefix, CssUtils, Promise);
	}

	combo(animations) {
		return new Combo(animations, Promise);
	}

}

window.Animator = new animator(); 