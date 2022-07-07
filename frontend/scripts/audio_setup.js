const AudioContext = window.AudioContext;
const audioCtx = new AudioContext();

let activeTrack = undefined;
let activeTrackPath = "";
export function setActiveTrack(track, path) {
  activeTrack = track;
  activeTrackPath = path;
}

export function getActiveTrackPath() {
  return activeTrackPath;
}

export function stopActiveTrack() {
  if (Boolean(activeTrack)) {
    activeTrack.stop();
    activeTrackPath = ""
  }
}

export function setActiveTrackTrate(newRate) {
  if (Boolean(activeTrack)) {
    activeTrack.playbackRate.setValueAtTime(newRate, audioCtx.currentTime);
  }
}

export async function enableAudio() {
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
}

export function getAudioTime() {
  return audioCtx.currentTime;
}

export async function getAudioBuffer(filepath) {
  const response = await fetch(filepath);
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
  return audioBuffer;
}

export async function createTrack(audioBuffer) {
  const trackSource = audioCtx.createBufferSource();
  trackSource.buffer = audioBuffer;
  trackSource.connect(audioCtx.destination);
  trackSource.loop = true;
  return trackSource;
}
