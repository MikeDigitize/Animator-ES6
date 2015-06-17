/**
  * @SequenceWrapper Class
  *
  * @description Intercepts all sequences and returns a single or combo sequence depending on whether a single HTMLElement or Nodelist is used.
  * @returns {Promise}
  */

class SequenceWrapper {

   /**
     * @constructor function
     *
     * @params {Object, Class, Class, Class, Class, Class, Class, Object}     
     * @description A wrapper that organises all sequences before they are launched. 
	 * @params description
	 	- options {Object} Object of sequence options.
	 	- DomUtils {Class} DOM utilities class.
	 	- Prefix {Class} Prefix class.
	 	- CssUtils {Class} CSS Utilities class.
	 	- Sequence {Class} The sequence type (Transition / Animation).
	 	- Combo {Class} Wrapper for multiple sequences.
	 	- Tracker {Object} Object to store and track sequences through.
	 * @returns {Promise}
     */
	
	constructor(options, DomUtils, Prefix, CssUtils, Sequence, Combo, Tracker) {

		if(options.element.length) {
			let transitions = Array.from(options.element).map((element) => {
				let opts = {};
				Object.keys(options).forEach((key) => {
					opts[key] = options[key];
				});
				opts.element = element;	 
				Tracker.track(opts, Sequence);
				return new Sequence(opts, DomUtils, Prefix, CssUtils, Tracker);
			});
			return new Combo(transitions);
		}
		else {
			Tracker.track(options, Sequence);
			return new Sequence(options, DomUtils, Prefix, CssUtils, Tracker);
		}		

	}

}

export default SequenceWrapper; 