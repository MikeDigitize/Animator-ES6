/**
  * @DomUtils Class
  *
  * @description Provides DOM utilities for Animator.
  * @returns {Object}
  */

class DomUtils {

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
     * @params {Class}
     * @description Tests for CSS transition / animation / CSSOM manipulation support
     * @params description      
     *  - Prefix: {Class} Prefix class.
     * @returns {Boolean}
     * @global yes
     */

	support(Prefix) {

		let prefix = new Prefix();
		let transitionSupport = prefix.getPrefix("transition");
		let animationSupport = prefix.getPrefix("animation");
		let raf = !!window.requestAnimationFrame;

		return transitionSupport && animationSupport && raf;

	}
	
}

export default DomUtils;