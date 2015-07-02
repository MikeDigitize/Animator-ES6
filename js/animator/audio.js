/**
  * @Audio Class
  *
  * @description Provides Audio sample playback / timing.
  * - check for web audio support
  * - if none defer back to audio element playback / volume only
  * - if supported play audio with panning, filtering, volume, loop options
  * @returns {Object}
  */

class Audio {

	constructor(config) {

		this.isWebAudioSupported = !!(window.AudioContext || window.webkitAudioContext);
		this.milliseconds = 0;
		this.audioSettings = Array.isArray(config) ? config : [...config];
		this.startTimer();

	}

	startTimer() {
		this.timer = setInterval(() => {
			this.milliseconds += 100;
			this.audioSettings.forEach((config) => {
				if(config.time === this.milliseconds) {
					this.isWebAudioSupported ?	this.playAudio(config) : this.playAudioFallback(config);
				}
			});
		}, 100);
	}

	playAudio(config) {

		let audioPlayer = new (window.AudioContext || window.webkitAudioContext)();
		let source = audioPlayer.createBufferSource();
		let request = new XMLHttpRequest();

		request.open("GET", config.audio, true);
		request.responseType = "arraybuffer";
		request.onload = () => {

			audioPlayer.decodeAudioData(request.response, (buffer) => {

				source.buffer = buffer;
				source.connect(audioPlayer.destination);
				source.start(0);

			},
			(e) => {
				"Error with decoding audio data" + e.err;
			});

		};

		request.send();

	}

	playAudioFallback(config) {
		let audioPlayer = document.createElement("audio");
		audioPlayer.src = config.audio;
		audioPlayer.play();
	}

	cancel() {
		clearInterval(this.timer);
		console.log("timer cancelled");
	}

}

export default Audio;