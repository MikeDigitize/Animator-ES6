export class Prefixes {
    
    constructor() {
        
        this.prefixes = new Map();
        this.testElement = document.createElement("div");

        /*
			Transforms
		*/

		this.prefixes.set("transform", ["webkitTransform", "transform"]);
		this.prefixes.set("transform-origin", ["webkitTransformOrigin", "transformOrigin"]);
		this.prefixes.set("transform-style", ["webkitTransformStyle", "transformStyle"]);

		/*
			Transitions
		*/

		this.prefixes.set("transition", ["webkitTransition", "transition"]);
		this.prefixes.set("transition-delay", ["webkitTransitionDelay", "transitionDelay"]);
		this.prefixes.set("transition-duration", ["webkitTransitionDuration", "transitionDuration"]);
		this.prefixes.set("transition-property", ["webkitTransitionProperty", "transitionProperty"]);
		this.prefixes.set("transition-timing-function", ["webkitTransitionTimingFunction", "transitionTimingFunction"]);

    }

    getPrefixes(prefix) {

		if(!this.prefixes.has(prefix)) {
			return false;
		}
		else {
			return this.prefixes
				.get(prefix)
				.filter(f => this.testElement.style[f] !== undefined)[0];
		}

	}

};

class someClass {
    constructor(name, age) {
        this.name = name;
        this.age = age;
 	}

    sayName() {
        alert(this.name);
    }

    sayAge() {
        alert(this.age);
    }
}

let test = new someClass("mike", 23);
console.log("test", test);

// const prefixes = new Map();
// const testElement = document.createElement("div");

// /*
// 	Transforms
// */

// prefixes.set("transform", ["webkitTransform", "transform"]);
// prefixes.set("transform-origin", ["webkitTransformOrigin", "transformOrigin"]);
// prefixes.set("transform-style", ["webkitTransformStyle", "transformStyle"]);

// /*
// 	Transitions
// */

// prefixes.set("transition", ["webkitTransition", "transition"]);
// prefixes.set("transition-delay", ["webkitTransitionDelay", "transitionDelay"]);
// prefixes.set("transition-duration", ["webkitTransitionDuration", "transitionDuration"]);
// prefixes.set("transition-property", ["webkitTransitionProperty", "transitionProperty"]);
// prefixes.set("transition-timing-function", ["webkitTransitionTimingFunction", "transitionTimingFunction"]);


// console.log(prefixes.size); 
// console.log(prefixes.has("transform-origin"));
// console.log(prefixes.get("transform"));


// export function getPrefixes(prefix) {

// 	let matches, match;

// 	if(!prefixes.has(prefix)) {
// 		return false;
// 	}
// 	else {
// 		return prefixes.get(prefix).filter(f => testElement.style[f] !== undefined)[0];
// 	}

// }