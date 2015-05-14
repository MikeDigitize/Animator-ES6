const prefixes = new Map();
const testElement = document.createElement("div");

prefixes.set("transform", ["webkitTransform", "transform"]);
prefixes.set("transform-origin", ["webkitTransformOrigin", "transformOrigin"]);
prefixes.set("transition", ["webkitTransition", "transition"]);

console.log(prefixes.size); 
console.log(prefixes.has("transform-origin"));
console.log(prefixes.get("transform"));

export function getPrefixes(prefix) {

	let match;

	prefixes.forEach(function (val, key) {
        if(key === prefix) {
        	val.forEach(function(f) {
	            if(testElement.style[f] !== undefined) {
	                match = f;
	            }
	        });
        }
    });

    return match;

}