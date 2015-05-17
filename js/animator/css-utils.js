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
            let params = [property];
            if(styles[property].includes("!important")) {
                styles[property] = styles[property].replace("!important", "");
                params.push("important");
            }
            params.splice(1, 0, styles[property]);
            params = params.join().split(",");
            element.style.setProperty(params[0], params[1], params[2] || null);
    	});
        
    }

    getStyles(element, props) {
    	let properties = props instanceof Array ? [...props] : [props];
    	let styles = {};
    	properties.forEach(property => {
    		styles[property] = window.getComputedStyle(element).getPropertyValue(property);
    	});
    	return styles; 
    }

}

export default CssUtils;