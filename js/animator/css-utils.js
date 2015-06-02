/**
 * @CssUtils Class
 *
 * @description CSS utility belt for Animator using the CSSOM (file:/// protocol not supported in Chrome) 
 * @returns {Object}
 */

class CssUtils {
	
	constructor() {
        
	}

    /**
     * @createStyleSheet function
     *
     * @description Creates a stylesheet for any transition / animation / style classes created in Animator.
     * @returns {CSSStyleSheet} stylesheet
     * @global no
     */

    createStyleSheet() {

        let style = document.createElement("style");
        style.appendChild(document.createTextNode(""));
        document.head.appendChild(style);
        return style.sheet;
        
    }

    /**
     * @setStyles function
     *
     * @params {HTMLElement, Object, Boolean}
     * @description Sets properties on an element's CSSStyleDeclaration.
     * @params description      
     *  - element: {HTMLElement} HTML element to set styles properties on.
        - styles : {Object} Object containing CSS property / value pairs.
        - important : Boolean specifiying if the CSS value is to be set as important. 
     * @global yes
     */

    setStyles(element, styles, important) {

    	Object.keys(styles).forEach(property => {        
            let important = important || styles[property].includes("important") ? "important" : null;
            let rules = styles[property].replace(/!?important/, "").trim(); 
            element.style.setProperty(property, rules, important);
    	});

    }

    /**
     * @getStyles function
     *
     * @params {HTMLElement, String / Array}
     * @description Queries properties set on an element's CSSStyleDeclaration.
     * @params description      
     *  - element: {HTMLElement} HTML element to query againts its style properties.
        - props : {String / Array} String or Array of strings of CSS properties to query.
     * @returns {Object} Object of CSS property / value pairs
     * @global yes
     */

    getStyles(element, props) {

    	let properties = Array.isArray(props) ? [...props] : [props];
    	let styles = {};
    	properties.forEach(property => {
    		styles[property] = window.getComputedStyle(element).getPropertyValue(property);
    	});
    	return styles;  

    }

    /**
     * @createTransition function
     *
     * @params {Object, Class}
     * @description Creates a string defining an element's CSS transition values and sets it on the element's CSSStyleDeclaration. 
     * @params description      
     *  - transition: {Object} An object of transition properties.
            - elements {HTMLElement / Nodelist} HTMLElement(s) to set transition on.
            - properties {String / Array} CSS properties to transition.
            - duration {String / Array} Ms or S transition duration value(s).
            - easing {String / Array} (Optional) Transition timing function value(s).
            - delay {String / Array} (Optional) Transition delay value(s).
        - prefix : {Class} Prefix class.
     * @global yes
     */

    createTransition(transition, Prefix) {

        let transitionPrefix = new Prefix().getPrefix("transition");
        let elements = transition.elements.length ? Array.from(transition.elements) : [transition.elements];
        let properties = Array.isArray(transition.properties) ? [...transition.properties] : [transition.properties];
        let duration = Array.isArray(transition.duration) ? [...transition.duration] : [transition.duration];
        let easing = Array.isArray(transition.easing) ? [...transition.easing] : [transition.easing];
        let delay = Array.isArray(transition.delay) ? [...transition.delay] : [transition.delay];

        elements.forEach(element => {

            let transitionString = "";
            let rules = {};

            properties.forEach((prop, i) => {

                transitionString += " ";
                transitionString += properties.length > 1 ? properties[i] + " " : properties[0] + " ";
                transitionString += duration.length > 1 ? duration[i] + " " : duration[0] + " ";
                transitionString += easing.length > 1 ? easing[i] + " " : (easing[0] || "ease") + " ";
                transitionString += delay.length > 1 ? delay[i] + "," : (delay[0] || "0s") + ",";

            });

            transitionString = transitionString.substr(0, transitionString.length - 1);
            rules[transitionPrefix] = transitionString;
            this.setStyles(element, rules);

        });

    }

    /**
     * @createKeyframeAnimation function
     *
     * @params {Object, Class, CSSStyleSheet}
     * @description Creates a CSS keyframe animation, and optional associated style class, and inserts it/them into Animator's stylesheet. 
     * @params description      
     *  - animation: {Object} An object of animation properties.
            - name {HTMLElement / Nodelist} HTMLElement(s) to set transition on.
            - animation {Object} Either from / to or % based keyframes and CSS properties / values.
            - animationClass {Object} (Optional) A CSS class to trigger the animation.
                - name {String} The classname.
                - rules {Object} Object of CSS property / value pairs.
        - prefix : {Class} Prefix class.
        - stylesheet : {CSSStyleSheet} Animator's stylesheet.
     * @global yes
     */

    createKeyframeAnimation(animation, Prefix, stylesheet) {

        let animationString = "";
        let prefix = new Prefix();
        let keyFrame = prefix.getPrefix("keyframes");        
        keyFrame += " " + animation.name + " {\n"

        Object.keys(animation.animation).forEach(anim => {
            animationString += anim + " {";
            Object.keys(animation.animation[anim]).forEach(property => {
                animationString += "\n" + property + " : " + animation.animation[anim][property] + ";";
            });
            animationString += "\n }\n";
        });

        animationString += "}";

        stylesheet.insertRule(keyFrame + animationString, stylesheet.cssRules.length);
        if(animation.animationClass) {
            this.createClass(animation.animationClass.name, stylesheet, animation.animationClass.rules);
        }

    }

    /**
     * @createClass function
     *
     * @params {String, CSSStyleSheet, Object (Optional)}
     * @description Defines a CSS class and inserts it into Animator's stylesheet. 
     * @params description      
     *  - className: {String} The name of the class.
        - stylesheet : {CSSStyleSheet} Animator's stylesheet.
        - rules : {Object} (Optional) Object of CSS property / value pairs.
     * @global yes
     */

    createClass(className, stylesheet, rules = {}) {

        let name = "." + className;
        let cssString = "{ ";

        Object.keys(rules).forEach(function(rule) {
            cssString += rule + " : " + rules[rule] + "; ";
        });

        cssString += "}";
        stylesheet.insertRule(name + cssString, stylesheet.cssRules.length);

    }

    /**
     * @deleteClass function
     *
     * @params {String, CSSStyleSheet}
     * @description Removes a CSS class from Animator's stylesheet. 
     * @params description      
     *  - className: {String} The name of the class to remove.
        - stylesheet : {CSSStyleSheet} Animator's stylesheet.
     * @global yes
     */

    deleteClass(className, stylesheet) {

        let rules = stylesheet.rules || stylesheet.cssRules;
        let name = "." + className;
        Object.keys(rules).forEach(rule => {
            if (rules[rule] instanceof CSSStyleRule && rules[rule].selectorText === name) {
                stylesheet.deleteRule(rule);
            }
        });

    }

}

export default CssUtils;