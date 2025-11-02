// Simple play/pause toggle for rotating disk
const playButton = document.getElementById("play");
let isPlaying = false;

playButton.addEventListener("click", () => {
  const disk = document.querySelector(".disk");

  if (!isPlaying) {
    // Switch to pause icon
    playButton.textContent = "pause";
    disk.style.animationPlayState = "running";
  } else {
    // Switch back to play icon
    playButton.textContent = "play_arrow";
    disk.style.animationPlayState = "paused";
  }

  isPlaying = !isPlaying;
});
window.addEventListener('resize', () => {
  if (window.innerWidth <= 550 && !window.location.href.includes('mobile')) {
    window.location.href = "index_mobile.html";
  } else if (window.innerWidth > 550 && window.location.href.includes('mobile')) {
    window.location.href = "index.html";
  }
});
