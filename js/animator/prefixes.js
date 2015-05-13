const prefixes = new Map();

prefixes.set("transform", ["webkitTransform", "transform"]);
prefixes.set("transform-origin", ["webkitTransformOrigin", "transformOrigin"]);
prefixes.set("transition", ["webkitTransition", "transition"]);

console.log(prefixes.size); 
console.log(prefixes.has("transform-origin"));
console.log(prefixes.get("transform"));

export function getPrefixes() {
  return prefixes.get("transform");
}