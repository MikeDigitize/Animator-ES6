/**
  * @Animator Class
  *
  * @description Houses all Animator functionality
  * @returns {Object}
  */

import Prefix from "./prefixes";
import CssUtils from "./css-utils";
import DomUtils from "./dom-utils";
import Animation from "./animation-seq";
import Transition from "./transition-seq";
import Combo from "./combo-seq";
import SequenceWrapper from "./seq-wrapper";
import Tracker from "./tracker";

class Animator { 

   /**
     * @constructor function
     *
     * @description Creates a stylesheet and Tracker object to be used throughout Animator.
     */
	
	constructor() {
		this.stylesheet = new CssUtils().createStyleSheet();
		this.tracker = new Tracker(DomUtils, Prefix, CssUtils, Transition);
	}

   /**
     * @getPrefix function
     *
     * @params {String}
     * @description Returns a prefixed CSS property or DOM event name.
     * @return {String}
     */

	getPrefix(prefix) {
		return new Prefix().getPrefix(prefix);
	}

   /**
     * @setStyles function
     *
     * @params {HTMLElement, String / Array}
     * @description Sets properties / values on an element's CSSStyleDeclaration.
     */

	setStyles(element, styles) {
		return new CssUtils().setStyles(element, styles);
	}

   /**
     * @getStyles function
     *
     * @params {HTMLElement, Object}
     * @description Return an object of CSS properties / values.
     * @return {Object}
     */

	getStyles(element, properties) {
		return new CssUtils().getStyles(element, properties);
	}

   /**
     * @createTransition function
     *
     * @params {Object}
     * @description Creates a CSS transition definition.
     */

	createTransition(transition) {
		new CssUtils().createTransition(transition, Prefix);
	}

   /**
     * @createAnimation function
     *
     * @params {Object}
     * @description Creates a CSS keyframe animation definition.
     */

	createAnimation(animation) {
		new CssUtils().createKeyframeAnimation(animation, Prefix, this.stylesheet);
	}

   /**
     * @createClass function
     *
     * @params {String, Object}
     * @description Creates a CSS class and appends it to the stylesheet.
     */

	createClass(className, rules) {
		new CssUtils().createClass(className, this.stylesheet, rules);
	}


   /**
     * @deleteClass function
     *
     * @params {String}
     * @description Deletes a CSS class from the stylesheet.
     */

	deleteClass(className) {
		new CssUtils().deleteClass(className, this.stylesheet);
	}

   /**
     * @createCSSRule function
     *
     * @params {String / Array, String / Array}
     * @description Returns a CSS property / value pairs object.
     * @returns {Object}
     */

  createCSSRule(property, value) {
    return new CssUtils().createCSSRule(property, value);
  }

   /**
     * @addClass function
     *
     * @params {HTMLElement / Nodelist, String / Array}
     * @description Sets a class(es) on an element.
     */

	addClass(element, classList) {
		new DomUtils().setClass(element, classList, true);
	}

   /**
     * @removeClass function
     *
     * @params {HTMLElement / Nodelist, String / Array}
     * @description Removes a class(es) from an element.
     */

	removeClass(element, classList) {
		new DomUtils().setClass(element, classList, false);
	}

   /**
     * @transition function
     *
     * @params {Object}
     * @description Creates a transition sequence.
     * @returns {Promise}
     */

	transition(options) {
		return new SequenceWrapper(options, DomUtils, Prefix, CssUtils, Transition, Combo, this.tracker);
	}

   /**
     * @animation function
     *
     * @params {Object}
     * @description Creates an animation sequence.
     * @returns {Promise}
     */

	animation(options) {
		return new SequenceWrapper(options, DomUtils, Prefix, CssUtils, Animation, Combo, this.tracker);
	}

   /**
     * @combo function
     *
     * @params {Object}
     * @description Creates an combination of sequence.
     * @returns {Promise}
     */

	combo(animations) {
		return new Combo(animations);
	}

   /**
     * @isSupported function
     *
     * @description Tests the browser for Animator support.
     * @returns {Boolean}
     */

	isSupported() {
		return new DomUtils().support(Prefix, CssUtils);
	}

   /**
     * @pause function
     *
     * @description Pause the current sequence.
     */

	pause() {
		this.tracker.pause();
	}

   /**
     * @play function
     *
     * @description Plays the current sequence.
     */

	play() {
		this.tracker.play();
	}

}

window.Animator = new Animator(); 