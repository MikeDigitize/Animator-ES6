import Prefix from './prefixes';
import CssUtils from './css-utils';
import * as promises from './promises';
import DomUtils from "./dom-utils"

var socket = io();
socket.on("userid", function(data) {
    console.log("socket id", data);
});

class animator {
	
	constructor() {
		
	}

	getPrefix(prefix) {
		return new Prefix().getPrefix(prefix);
	}

	setStyles(element, styles) {
		return new CssUtils().setStyles(element, styles);
	}

	addClass(element, classList) {
		return new DomUtils().setClass(element, classList, false);
	}

	removeClass(element, classList) {
		return new DomUtils().setClass(element, classList, true);
	}

} 

window.Animator = new animator();