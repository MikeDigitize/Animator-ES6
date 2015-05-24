import Prefix from "./prefixes";
import CssUtils from "./css-utils";
import DomUtils from "./dom-utils";
import Animation from "./animation-seq";
import Transition from "./transition-seq";
import Combo from "./combo-seq";
import SequenceWrapper from "./seq-wrapper";
import Tracker from "./tracker";
import { Promise as Promise } from "./es6-promise";

class Animator { 
	
	constructor() {
		this.stylesheet = new CssUtils().createStyleSheet();
		this.tracker = new Tracker(DomUtils, Prefix, CssUtils, Transition);
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
		return new CssUtils().createTransition(transitions, Prefix);
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
		return new SequenceWrapper(options, DomUtils, Prefix, CssUtils, Promise, Transition, Combo, this.tracker);
	}

	animation(options) {
		return new SequenceWrapper(options, DomUtils, Prefix, CssUtils, Promise, Animation, Combo, this.tracker);
	}

	combo(animations) {
		return new Combo(animations, Promise, this.tracker, Transition);
	}

	stop() {
		return this.tracker.stop();
	}

}

window.Animator = new Animator(); 