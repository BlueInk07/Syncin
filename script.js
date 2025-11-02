document.querySelector('.add-more').addEventListener('click', () => {
  alert('Add More functionality will go here!');
});

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

// ------------------------------
// PLAYER SETUP
// ------------------------------
const playPauseIcon = document.querySelector('.icon.play-pause');
const audio = document.getElementById('audio-player');
const disk = document.querySelector('.rotating-disk');
const diskCenter = document.querySelector('.disk-center');
const loopIcon = document.querySelector('.icon.loop');
const forwardIcon = document.querySelector('.icon.forward');
const backwardIcon = document.querySelector('.icon.backward');
const lyricsBox = document.querySelector('.lyrics-content');

let rotationAngle = 0;
let isRotating = false;
let rotationRequest;

function rotateDisk() {
  rotationAngle = (rotationAngle + 0.3) % 360;
  disk.style.transform = `rotate(${rotationAngle}deg)`;
  rotationRequest = requestAnimationFrame(rotateDisk);
}

function startDiskRotation() {
  if (!isRotating) {
    isRotating = true;
    rotationRequest = requestAnimationFrame(rotateDisk);
  }
}

function stopDiskRotation() {
  isRotating = false;
  cancelAnimationFrame(rotationRequest);
}

// ------------------------------
// PLAY / PAUSE CONTROL
// ------------------------------
playPauseIcon.addEventListener('click', () => {
  if (playPauseIcon.textContent.trim() === 'play_arrow') {
    playPauseIcon.textContent = 'pause';
    audio.play();
    startDiskRotation();
  } else {
    playPauseIcon.textContent = 'play_arrow';
    audio.pause();
    stopDiskRotation();
  }
});

audio.addEventListener('pause', stopDiskRotation);
audio.addEventListener('play', startDiskRotation);

// ------------------------------
// VERTICAL PROGRESS BAR SYNC
// ------------------------------
const verticalProgress = document.querySelector('.progress-vertical');
const currentVertical = document.querySelector('.current-time-vertical');
const totalVertical = document.querySelector('.total-time-vertical');

audio.addEventListener('loadedmetadata', function () {
  totalVertical.textContent = formatTime(audio.duration);
  verticalProgress.max = audio.duration;
});

audio.addEventListener('timeupdate', function () {
  verticalProgress.value = audio.currentTime;
  currentVertical.textContent = formatTime(audio.currentTime);
});

verticalProgress.addEventListener('input', function () {
  audio.currentTime = verticalProgress.value;
});

function formatTime(seconds) {
  let m = Math.floor(seconds / 60);
  let s = Math.floor(seconds % 60);
  if (isNaN(m) || isNaN(s)) return "0:00";
  if (s < 10) s = "0" + s;
  return `${m}:${s}`;
}

// ------------------------------
// PLAYLISTS
// ------------------------------
const playlists = document.querySelectorAll('.playlist');
const bottomNavbar = document.querySelector('.bottom-navbar');
let currentPlaylist = [];
let currentSongIndex = 0;

const playlistSongs = {
  0: [
    { img: '../images/img 11.jpeg', name: 'This is what winter...', artist: 'JVKE', file: '../audios/11.mp3' },
    { img: '../images/img 12.jpeg', name: 'Blue', artist: 'Yung Kai', file: '../audios/12.mp3' },
    { img: '../images/img 13.jpeg', name: 'Dandelions', artist: 'Ruth B', file: '../audios/13.mp3' },
    { img: '../images/img 14.jpeg', name: 'Way back home', artist: 'Shaun', file: '../audios/14.mp3' }
  ],
  1: [
    { img: '../images/img 15.jpeg', name: 'Say yes to heaven', artist: 'Lana del ray', file: '../audios/15.mp3' },
    { img: '../images/img 16.jpeg', name: 'Moonlight', artist: 'Kali Uchis', file: '../audios/16.mp3' },
    { img: '../images/img 17.jpeg', name: 'Cinnamon Girl', artist: 'Lana del ray', file: '../audios/17.mp3' },
    { img: '../images/img 18.jpeg', name: 'Beanie', artist: 'Chezile', file: '../audios/18.mp3' }
  ],
  2: [
    { img: '../images/img 19.jpeg', name: 'Sugar Crash!', artist: 'Elly Otto', file: '../audios/19.mp3' },
    { img: '../images/img 20.jpeg', name: 'One dance(reverb)', artist: 'Drake (feat. Wizkid & Kyla)', file: '../audios/20.mp3' },
    { img: '../images/img 21.jpeg', name: 'On the floor', artist: 'Jennifer Lopez(feat.Pitbull)', file: '../audios/21.mp3' },
    { img: '../images/img 22.jpeg', name: 'Savage Love ', artist: 'Jason Darulo', file: '../audios/22.mp3' }
  ],
  3: [
    { img: '../images/img 23.jpeg', name: 'I was never there', artist: 'The Weeknd', file: '../audios/23.mp3' },
    { img: '../images/img 24.jpeg', name: 'The Machine', artist: 'Reed Wonder, Aurora Olivas', file: '../audios/24.mp3' },
    { img: '../images/img 25.jpeg', name: 'YAD', artist: 'Vanna Rainelle ', file: '../audios/25.mp3' },
    { img: '../images/img 26.jpeg', name: 'Under the influence', artist: 'Chris Brown', file: '../audios/26.mp3' }
  ]
};

// ------------------------------
// LOAD & PLAY SONG
// ------------------------------
function loadSong(index) {
  const song = currentPlaylist[index];
  if (!song) return;
  currentSongIndex = index;
  audio.src = song.file;
  diskCenter.src = song.img;
  audio.play();
  playPauseIcon.textContent = 'pause';
  startDiskRotation();
  highlightActiveSong(index);
  loadLyrics(index); // load the lyrics with glitch aura
}

function highlightActiveSong(index) {
  const tiles = document.querySelectorAll('.song-tile');
  tiles.forEach((t, i) => {
    t.classList.toggle('active-song', i === index);
    t.classList.toggle('next-song', i === index + 1);
  });
}

// ------------------------------
// QUEUE FUNCTIONALITY
// ------------------------------
audio.addEventListener('ended', () => {
  if (!currentPlaylist.length) return;
  currentSongIndex++;
  if (currentSongIndex >= currentPlaylist.length) {
    currentSongIndex = 0;
  }
  loadSong(currentSongIndex);
});

// ------------------------------
// LOAD LYRICS WITH GLITCH AURA EFFECT
// ------------------------------
async function loadLyrics(index) {
  const song = currentPlaylist[index];
  if (!song) return;
  const songNumber = song.file.match(/(\d+)\.mp3$/)?.[1];
  if (!songNumber) return;

  try {
    const response = await fetch(`../lyrics/${songNumber}.txt`);
    if (!response.ok) throw new Error('Lyrics not found');
    const text = await response.text();
    displayLyricsWithAura(text);
  } catch (err) {
    lyricsBox.textContent = "No lyrics available for this song.";
  }
}

// ------------------------------
// GLITCH + AURA LYRICS EFFECT
// ------------------------------
function displayLyricsWithAura(lyricsText) {
  lyricsBox.classList.add('hover-glitch');
  const chars = lyricsText
    .trim()
    .split('')
    .map(ch => (ch === ' ' ? '&nbsp;' : `<span>${ch}</span>`))
    .join('');
  lyricsBox.innerHTML = chars;

  const spans = lyricsBox.querySelectorAll('span');

  lyricsBox.addEventListener('mousemove', e => {
    spans.forEach(span => {
      const rect = span.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = 120;
      const intensity = Math.max(0, 1 - dist / maxDist);

      if (intensity > 0.3) {
        span.classList.add('glitch-active');
        const glow = Math.floor(10 + 30 * intensity);
       // detect current theme
const isDark = document.body.classList.contains('dark-theme');

// theme-based color palettes
const baseText = isDark ? `rgba(0,0,0,${0.7 + intensity * 0.3})` : `rgba(255,255,255,${0.7 + intensity * 0.3})`;
const glowCyan = isDark ? `rgba(0,255,255,${0.25 + intensity * 0.4})` : `rgba(0,255,255,${0.4 + intensity * 0.6})`;
const glowMagenta = isDark ? `rgba(255,0,255,${0.15 + intensity * 0.3})` : `rgba(255,0,255,${0.3 + intensity * 0.5})`;

span.style.textShadow = `
  0 0 ${glow}px ${glowCyan}, 
  0 0 ${glow * 1.5}px ${glowMagenta}
`;
span.style.transform = `scale(${1 + intensity * 0.2})`;
span.style.color = baseText;

      }
    });
  });

  lyricsBox.addEventListener('mouseleave', () => {
    spans.forEach(span => {
      span.classList.remove('glitch-active');
      span.style.textShadow = 'none';
      span.style.transform = 'scale(1)';
      span.style.color = document.body.classList.contains('dark-theme') ? '#0b0b0b' : '#ffffffb0';

    });
  });
}
// ------------------------------
// AUTO-SCROLL LYRICS WITH SONG (smoothed + slowed)
// ------------------------------
let autoScrollActive = false;
let lastScrollUpdate = 0;

audio.addEventListener('timeupdate', () => {
  if (!lyricsBox || !autoScrollActive) return;

  const now = Date.now();
  if (now - lastScrollUpdate < 1500) return; // update every 1.5s
  lastScrollUpdate = now;

  const maxScroll = lyricsBox.scrollHeight - lyricsBox.clientHeight;
  if (maxScroll <= 0) return;

  const duration = audio.duration || 300; // assume max ~5min
  const ratio = Math.min(audio.currentTime / duration, 1);
  lyricsBox.scrollTop = maxScroll * ratio;
});

audio.addEventListener('play', () => (autoScrollActive = true));
audio.addEventListener('pause', () => (autoScrollActive = false));
audio.addEventListener('ended', () => {
  autoScrollActive = false;
  lyricsBox.scrollTop = 0;
});


// ------------------------------
// PLAYLIST CLICK HANDLER
// ------------------------------
playlists.forEach((p, index) => {
  p.addEventListener('click', () => {
    const songs = playlistSongs[index];
    if (!songs) return;
    currentPlaylist = songs;
    currentSongIndex = 0;

    playlists.forEach(pl => pl.classList.remove('active-playlist'));
    p.classList.add('active-playlist');

    diskCenter.src = songs[0].img;
    bottomNavbar.innerHTML = '';

    songs.forEach((song, i) => {
      const tile = document.createElement('div');
      tile.classList.add('song-tile');
      tile.innerHTML = `
        <img src="${song.img}" alt="${song.name}">
        <div class="song-info">
          <p class="song-name">${song.name}</p>
          <p class="artist-name">${song.artist}</p>
        </div>
      `;
      tile.addEventListener('click', () => loadSong(i));
      bottomNavbar.appendChild(tile);
    });

    bottomNavbar.classList.add('show');
    loadSong(0);
  });
});

// ------------------------------
// FORWARD / BACKWARD BUTTONS
// ------------------------------
forwardIcon.addEventListener('click', () => {
  if (!currentPlaylist.length) return;
  currentSongIndex = (currentSongIndex + 1) % currentPlaylist.length;
  loadSong(currentSongIndex);
});

backwardIcon.addEventListener('click', () => {
  if (!currentPlaylist.length) return;
  currentSongIndex = (currentSongIndex - 1 + currentPlaylist.length) % currentPlaylist.length;
  loadSong(currentSongIndex);
});

// ------------------------------
// LOOP BUTTON
// ------------------------------
let loopEnabled = false;
loopIcon.addEventListener('click', () => {
  loopEnabled = !loopEnabled;
  audio.loop = loopEnabled;
  loopIcon.style.color = loopEnabled ? 'lime' : 'white';
});

// ------------------------------
// BACKGROUND + THEME (unchanged)
// ------------------------------
const settingsIcon = document.querySelector('.fa-gear');
const bgModal = document.querySelector('.bg-modal');
const closeModal = document.querySelector('.close-bg-modal');
const bgUpload = document.getElementById('bg-upload');
const defaultBgs = document.querySelectorAll('.default-bg');

settingsIcon.addEventListener('click', () => bgModal.classList.remove('hidden'));
closeModal.addEventListener('click', () => bgModal.classList.add('hidden'));

defaultBgs.forEach(bg => {
  bg.addEventListener('click', () => {
    document.body.style.backgroundImage = `url(${bg.src})`;
    bgModal.classList.add('hidden');
  });
});

bgUpload.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = e => document.body.style.backgroundImage = `url(${e.target.result})`;
    reader.readAsDataURL(file);
    bgModal.classList.add('hidden');
  }
});

const themeBoxes = document.querySelectorAll('.theme-box');
themeBoxes.forEach(box => {
  box.addEventListener('click', () => {
    themeBoxes.forEach(b => b.classList.remove('active'));
    box.classList.add('active');
    const theme = box.classList.contains('light') ? 'light' : 'dark';
    document.body.classList.toggle('light-theme', theme === 'light');
    document.body.classList.toggle('dark-theme', theme === 'dark');
    bgModal.classList.add('hidden');
    localStorage.setItem('theme', theme);
  });
});

const saved = localStorage.getItem('theme');
if (saved) {
  document.body.classList.add(`${saved}-theme`);
  document.querySelector(`.theme-box.${saved}`).classList.add('active');
}
