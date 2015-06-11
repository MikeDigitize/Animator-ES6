/**
  * @DomUtils Class
  *
  * @description Provides DOM utilities for Animator.
  * @returns {Object}
  */

class DomUtils {

	constructor() {

	}

   /**
     * @setClass function
     *
     * @params {HTMLElement, String / Array, Boolean}
     * @description Adds or removes class(es) from an element.
     * @params description      
     *  - element: {HTMLElement} The element to add / remove the class(es) to / from.
     *  - classList: {String / Array} A single classname or array of classnames to add / remove.
     *	- add: {Boolean} Specifiying whether to add / remove the class(es).
     * @global yes
     */

	setClass(element, classList, add) {

		let classes = Array.isArray(classList) ? [...classList] : [classList];
		let elements = element.length ? Array.from(element) : [element];
		let action = add ? "add" : "remove";
		classes.forEach(cls => {
			elements.forEach(el => {
				el.classList[action](cls);
			});			
		});

	}

   /**
     * @support function
     *
     * @params {Class, Class, CSSStyleSheet}
     * @description Tests for CSS transition / animation / CSSOM manipulation support
     * @params description      
     *  - Prefix: {Class} Prefix class.
     *  - CssUtils: {Class} CSS utilities class.
     *	- stylesheet: {CSSStyleSheet} Stylesheet to test inserting / removing style rules on.
     * @returns {Boolean}
     * @global yes
     */

	support(Prefix, CssUtils, stylesheet) {

		let prefix = new Prefix();
		let cssUtils = new CssUtils();
		let cssomSupport = false;
		let transitionSupport = prefix.getPrefix("transition");
		let animationSupport = prefix.getPrefix("animation");

		try {
			cssUtils.createClass("AnimatorTestClass", stylesheet);
			cssUtils.deleteClass("AnimatorTestClass", stylesheet);
			cssomSupport = true;
		}
		catch(e) {
			cssomSupport = false;
		}

		return transitionSupport && animationSupport && cssomSupport;

	}
	
}

export default DomUtils;