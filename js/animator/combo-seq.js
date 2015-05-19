import { Promise as p } from "./es6-promise";
let Promise = p;

class Combo {
	constructor(sequences) {

		return new Promise((resolve, reject) => {

			let watcher = this.sequenceWatcher();
			this.resolve = resolve;
			this.reject = reject;
			this.amount = sequences.length;

			sequences.forEach(sequence => {
				sequence.then(element => {
					watcher(element);
				});
			});
			
		});

	}

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