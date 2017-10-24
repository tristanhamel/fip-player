const domain = 'http://localhost:8080';
const URL = domain + '/api';

export default function(audioElement) {
  audioElement.setAttribute('crossorigin', 'anonymous');
  audioElement.setAttribute('src', URL);
  audioElement.play();
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)(); // define audio context
  const source = audioCtx.createMediaElementSource(audioElement);
  const analyser = audioCtx.createAnalyser();
  source.connect(analyser);
  analyser.connect(audioCtx.destination);
  analyser.fftSize = 64;
  const frequencyData = new Uint8Array(analyser.fftSize);

  setInterval(() => {
    analyser.getByteFrequencyData(frequencyData);
    console.log(frequencyData.map(n => n /2));
  }, 500);
}

