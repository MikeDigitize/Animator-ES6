class DomUtils {

	constructor() {

	}

	setClass(element, classList, remove) {
		let classes = classList instanceof Array ? [...classList] : [classList];
		let action = remove ? "remove" : "add";
		classes.forEach(c => {
			element.classList[action](c);
		});
	}
}

export default DomUtils;