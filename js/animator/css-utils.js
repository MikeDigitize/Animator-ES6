import Prefix from "./prefixes";

class CssUtils {
	
	constructor() {
        let style = document.createElement("style");
        style.appendChild(document.createTextNode(""));
        document.head.appendChild(style);
        this.stylesheet = style.sheet;
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

    createTransition(transitions) {

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

            // remove trailing comma
            transitionString = transitionString.substr(0, transitionString.length - 1);
            rules[transitionPrefix] = transitionString;
            this.setStyles(element, rules);

        });

    }

    createClass(className, rules) {

        console.log(this.stylesheet, rules);

        let name = "." + className;
        let styleRules = rules || {};
        let cssString = "{ ";

        Object.keys(styleRules).forEach(function(rule) {
            cssString += rule + " : " + rules[rule] + "; ";
        });

        cssString += "}";

        console.log(cssString);
        this.stylesheet.insertRule(name + cssString, this.stylesheet.cssRules.length);

    }

}

export default CssUtils;