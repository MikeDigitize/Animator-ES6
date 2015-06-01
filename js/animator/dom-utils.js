class DomUtils {

	constructor() {

	}

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

	support(Prefix, CssUtils, stylesheet) {

		let prefix = new Prefix();
		let cssUtils = new CssUtils();
		let cssomSupport = false;
		let transitionSupport = prefix.getPrefix("transition");
		let animationSupport = prefix.getPrefix("animation");

		try {
			cssUtils.createClass("AnimatorTestClass", {}, stylesheet);
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