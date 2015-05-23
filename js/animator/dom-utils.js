class DomUtils {

	constructor() {

	}

	setClass(element, classList, add) {

		let classes = Array.isArray(classList) ? [...classList] : [classList];
		let action = add ? "add" : "remove";
		classes.forEach(c => {
			element.classList[action](c);
		});

	}
	
}

export default DomUtils;