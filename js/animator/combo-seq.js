/**
  * @Combo Class
  *
  * @description Wraps a Promise around x amount of sequences and resolves when all sequences have resolved.
  * @returns {Resolved Promise}
  */

class Combo {

   /**
     * @constructor function
     *
     * @params {Array, Class}  
     * @description Wraps x amount of sequences in a Promise.    
	 * @params description
	 	- sequences {Array} An array of sequences.
	 	- Promise {Class} Promise class.
	 * @returns {Promise}
     */
	
	constructor(sequences, Promise) {

		return new Promise((resolve, reject) => {

			let watcher = this.sequenceWatcher();
			this.resolve = resolve;
			this.reject = reject;
			this.amount = sequences.length;

			sequences.forEach(sequence => {
				
				sequence.then(element => {
					watcher(element);
				})
				.catch(e => {
					this.reject(e);
				});

			});
			
		});

	}

   /**
     * @sequenceWatcher function
     *
     * @description Captures resolved sequences and resolves when all have been resolved.   
	 * @returns {Resolved Promise}
     * @global no
     */

	sequenceWatcher() {

		let count = 0;
		let returnData = [];
		return element => {

			count++;
			returnData.push(element);
			if(count === this.amount) {
				this.resolve(returnData);
			}

		}

	}

}

export default Combo;