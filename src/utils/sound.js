// ─── Sound file imports ───────────────────────────────
import sound1 from '../assets/Sound1.mp3';
import sound2 from '../assets/Sound2.mp3';

// Pre-create and preload the audio elements
const successAudio = new Audio(sound1);
successAudio.preload = 'auto';

const errorAudio = new Audio(sound2);
errorAudio.preload = 'auto';

const bootAudio = new Audio(sound1);
bootAudio.preload = 'auto';

let lastSuccessTime = 0;
let lastErrorTime = 0;

// ─── Exported functions ───────────────────────────────

export const playSuccess = () => {
  const now = Date.now();
  if (now - lastSuccessTime < 300) return;
  lastSuccessTime = now;
  
  successAudio.pause();
  successAudio.currentTime = 0;
  successAudio.volume = 0.5;
  successAudio.play().catch(() => {});
};

export const playError = () => {
  const now = Date.now();
  if (now - lastErrorTime < 300) return;
  lastErrorTime = now;
  
  errorAudio.pause();
  errorAudio.currentTime = 0;
  errorAudio.volume = 0.6;
  errorAudio.play().catch(() => {});
};

export const playBoot = () => {
  bootAudio.pause();
  bootAudio.currentTime = 0;
  bootAudio.volume = 0.3;
  bootAudio.play().catch(() => {});
};
