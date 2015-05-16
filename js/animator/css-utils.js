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
    		element.style[this.cssTextToJs(property)] = styles[property];
    	});
    }

    getStyles(element, style) {
    	
    }

}

export default CssUtils;