class CssUtils {
	
	constructor() {
        
	}

	cssTextToJs(cssText) {

        let jsText = "";

        if(/\-/g.test(cssText)) {
            cssText.replace(/\-/g, " ").replace(/\w\S*/g, function(txt) {
                txt = txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                if(txt){
                    jsText += txt;
                }
            });
            return jsText.charAt(0).toLowerCase() + jsText.substr(1);
        }
        else {
            return cssText;
        }

    }

    createStyleSheet(title = "") {

        let style = document.createElement("style");
        style.appendChild(document.createTextNode(""));
        document.head.appendChild(style);
        style.setAttribute("title", title);
        return style.sheet;
        
    }

    setStyles(element, styles, important) {

    	Object.keys(styles).forEach(property => {            
            let important = important || styles[property].includes("important") ? "important" : null;
            let rules = styles[property].replace(/!?important/, "").trim();
            element.style.setProperty(property, rules, important);
    	});

    }

    getStyles(element, props) {

    	let properties = Array.isArray(props) ? [...props] : [props];
    	let styles = {};
    	properties.forEach(property => {
    		styles[property] = window.getComputedStyle(element).getPropertyValue(property);
    	});
    	return styles; 

    }

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
            this.createClass(animation.animationClass.name, animation.animationClass.rules, stylesheet);
        }

    }

    createClass(className, rules, stylesheet) {

        let name = "." + className;
        let cssString = "{ ";

        Object.keys(rules).forEach(function(rule) {
            cssString += rule + " : " + rules[rule] + "; ";
        });

        cssString += "}";
        stylesheet.insertRule(name + cssString, stylesheet.cssRules.length);

    }

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