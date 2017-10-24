import * as settings from '../settings';

const domain = 'http://localhost:8080';
const URL = domain + '/api';

let analyser, frequencyData, audioElement, timer;

let isPlaying = false;

export function init(element) {
  audioElement = element;
  audioElement.setAttribute('crossorigin', 'anonymous');
  audioElement.setAttribute('src', URL);
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)(); // define audio context
  const source = audioCtx.createMediaElementSource(audioElement);
  analyser = audioCtx.createAnalyser();
  source.connect(analyser);
  analyser.connect(audioCtx.destination);
  analyser.fftSize = 64;
  frequencyData = new Uint8Array(analyser.fftSize);
}

export function start() {
  isPlaying = !isPlaying;
  audioElement.play();
}

export function getData() {
  analyser.getByteFrequencyData(frequencyData);
  return formatData(frequencyData);
}

export function stop() {
  isPlaying = !isPlaying;
  audioElement.stop();
}

function formatData(data) {
  const formatted = Array.from(data)
    .slice(0, 32)
    .map((n, i) => i % 2 ? -1*n : n)
    .map(n => Math.round((settings.viewBox.h / 4) * n / 255));

  return [0, ...formatted, 0];
}
