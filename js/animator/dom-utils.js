class DomUtils {

	constructor() {

	}

	setClass(element, classList, add) {

		let classes = classList instanceof Array ? [...classList] : [classList];
		let action = add ? "add" : "remove";

		console.log(element, classes, action);
		classes.forEach(c => {
			element.classList[action](c);
		});
	}
}

export default DomUtils;