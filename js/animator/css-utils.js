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



    setStyles(element, styles) {

    	Object.keys(styles).forEach(property => {            
            let important = styles[property].includes("important") ? "important" : null;
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

    createTransition(transitions, Prefix) {

        let transitionPrefix = new Prefix().getPrefix("transition");
        let elements = transitions.elements.length ? Array.from(transitions.elements) : [transitions.elements];
        let properties = Array.isArray(transitions.properties) ? [...transitions.properties] : [transitions.properties];
        let duration = Array.isArray(transitions.duration) ? [...transitions.duration] : [transitions.duration];
        let easing = Array.isArray(transitions.easing) ? [...transitions.easing] : [transitions.easing];
        let delay = Array.isArray(transitions.delay) ? [...transitions.delay] : [transitions.delay];

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

    createClass(className, rules = {}, stylesheet) {

        let name = "." + className;
        let cssString = "{ ";

        Object.keys(rules).forEach(function(rule) {
            cssString += rule + " : " + rules[rule] + "; ";
        });

        cssString += "}";
        stylesheet.insertRule(name + cssString, stylesheet.cssRules.length);

    }

    deleteClass(className, stylesheet) {

        let rules = stylesheet.rules;
        let name = "." + className;
        Object.keys(rules).forEach(rule => {
            if (rules[rule] instanceof CSSStyleRule && rules[rule].selectorText === name) {
                stylesheet.deleteRule(rule);
            }
        });

    }

}

export default CssUtils;