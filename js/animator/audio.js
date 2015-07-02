/**
  * @Audio Class
  *
  * @description Provides Audio sample playback / timing.
  * - check for web audio support
  * - if none defer back to audio element playback / volume only
  * - if supported play audio with panning, filtering, volume options
  * @returns {Object}
  */

class Audio {

	constructor(config) {

		this.milliseconds = 0;
		this.audioSettings = Array.isArray(config) ? config : [...config];
		this.startTimer();

	}

	startTimer() {
		this.timer = setInterval(() => {
			this.milliseconds += 100;
			this.audioSettings.forEach((config) => {
				if(config.time === this.milliseconds) {
					this.playAudio(config);
				}
			});
		}, 100);
	}

	playAudio(config) {

		let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
		let source = audioCtx.createBufferSource();
		let request = new XMLHttpRequest();

		request.open("GET", config.audio, true);
		request.responseType = "arraybuffer";
		request.onload = () => {

			audioCtx.decodeAudioData(request.response, (buffer) => {

				source.buffer = buffer;
				source.connect(audioCtx.destination);
				source.loop = true;

				source.start(0);
				setTimeout(() => {
					source.stop(0);
				}, (buffer.duration * 1000));
			},
			(e) => {
				"Error with decoding audio data" + e.err;
			});

		};

		request.send();

	}

	cancel() {
		clearInterval(this.timer);
		console.log("timer cancelled");
	}

}

export default Audio;