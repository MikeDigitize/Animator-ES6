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
	
}

export default DomUtils;