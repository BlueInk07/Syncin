// "Add More" button
document.querySelector('.add-more').addEventListener('click', () => {
  alert('Add More functionality will go here!');
});

// Right navbar scroll bar customizations
const navbar = document.querySelector('.right-navbar');
navbar.addEventListener('scroll', () => {
  const scrollHeight = navbar.scrollHeight - navbar.clientHeight;
  const scrollTop = navbar.scrollTop;
  const scrollPercent = scrollTop / scrollHeight;
  const minWidth = 10;
  const maxWidth = 19;
  const newWidth = minWidth + (maxWidth - minWidth) * scrollPercent;
  const minGlow = 1.0;
  const maxGlow = 2.0;
  const newGlow = minGlow + (maxGlow - minGlow) * scrollPercent;
  const maxHeight = 40;
  const minHeight = 30;
  const newHeight = maxHeight - (maxHeight - minHeight) * scrollPercent;

  navbar.style.setProperty('--thumb-width', `${newWidth}px`);
  navbar.style.setProperty('--glow-opacity', newGlow);
  navbar.style.setProperty('--thumb-height', `${newHeight}px`);
});

// Play/pause icon animation and symbol switching
const playPauseIcon = document.querySelector('.icon.play-pause');
const audio = document.getElementById('audio-player');

playPauseIcon.addEventListener('click', () => {
  if (playPauseIcon.textContent.trim() === 'play_arrow') {
    playPauseIcon.textContent = 'pause';
    audio.play();
  } else {
    playPauseIcon.textContent = 'play_arrow';
    audio.pause();
  }
});

// Vertical progress bar logic
const verticalProgress = document.querySelector('.progress-vertical');
const currentVertical = document.querySelector('.current-time-vertical');
const totalVertical = document.querySelector('.total-time-vertical');

// Audio metadata loaded
audio.addEventListener('loadedmetadata', function () {
  totalVertical.textContent = formatTime(audio.duration);
  verticalProgress.max = audio.duration;
});

// Update vertical progress bar as audio plays
audio.addEventListener('timeupdate', function () {
  verticalProgress.value = audio.currentTime;
  currentVertical.textContent = formatTime(audio.currentTime);
});

// Seek functionality on vertical progress bar
verticalProgress.addEventListener('input', function () {
  audio.currentTime = verticalProgress.value;
});

// Helper function to format seconds as M:SS
function formatTime(seconds) {
  let m = Math.floor(seconds / 60);
  let s = Math.floor(seconds % 60);
  if (isNaN(m) || isNaN(s)) return "0:00";
  if (s < 10) s = "0" + s;
  return `${m}:${s}`;
}
