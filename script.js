


const tracks = [
  { title: "Song 01", file: "songs/1.mp4" },
  { title: "Song 02", file: "songs/2.mp4" },
  { title: "Song 03", file: "songs/3.mp4" },
  { title: "Song 04", file: "songs/4.mp4" },
  { title: "Song 05", file: "songs/5.mp4" },
  { title: "Song 06", file: "songs/6.mp4" },
  { title: "Song 07", file: "songs/7.mp4" },
  { title: "Song 08", file: "songs/8.mp4" },
  { title: "Song 09", file: "songs/9.mp4" },
  { title: "Song 10", file: "songs/10.aac" }
];




const audio = document.getElementById('audio');
const grid = document.getElementById('trackGrid');
const nowTitle = document.getElementById('nowTitle');
const playBtn = document.getElementById('playBtn');
const seekBar = document.getElementById('seekBar');
let current = -1;

function renderTracks(){
  grid.innerHTML = tracks.map((track,i) => `
    <button class="track-card" data-index="${i}" type="button" aria-label="Play ${track.title}">
      <span class="track-art"><span>${String(i+1).padStart(2,'0')}</span><i class="track-play">▶</i></span>
      <span class="track-title">${track.title}</span>
      <span class="track-sub">Her voice · Track ${i+1}</span>
    </button>
  `).join('');
  grid.querySelectorAll('.track-card').forEach(card => {
    card.addEventListener('click', () => loadTrack(Number(card.dataset.index), true));
  });
}

function loadTrack(index, autoplay=false){
  current = index;
  const track = tracks[current];
  audio.src = track.file;
  nowTitle.textContent = track.title;
  document.querySelectorAll('.track-card').forEach((card,i) => {
    card.classList.toggle('active', i === current);
    const icon = card.querySelector('.track-play');
    icon.textContent = i === current && !audio.paused ? 'Ⅱ' : '▶';
  });
  seekBar.value = 0;
  document.getElementById('currentTime').textContent = '0:00';
  document.getElementById('totalTime').textContent = '0:00';
  if(autoplay) playAudio();
}

async function playAudio(){
  if(current < 0) loadTrack(0, false);
  try{
    await audio.play();
    playBtn.textContent = 'Ⅱ';
    updateCards();
  }catch(error){
    playBtn.textContent = '▶';
    alert('Audio file not found. Add your MP3 recording inside the songs folder with the correct file name.');
  }
}

function updateCards(){
  document.querySelectorAll('.track-card').forEach((card,i) => {
    card.querySelector('.track-play').textContent = i === current && !audio.paused ? 'Ⅱ' : '▶';
  });
}

playBtn.addEventListener('click', () => {
  if(current < 0){ loadTrack(0, true); return; }
  if(audio.paused) playAudio();
  else { audio.pause(); playBtn.textContent='▶'; updateCards(); }
});

document.getElementById('nextBtn').addEventListener('click', () => loadTrack((current+1+tracks.length)%tracks.length, true));
document.getElementById('prevBtn').addEventListener('click', () => loadTrack((current-1+tracks.length)%tracks.length, true));
audio.addEventListener('ended', () => loadTrack((current+1)%tracks.length, true));
audio.addEventListener('play', updateCards);
audio.addEventListener('pause', updateCards);
audio.addEventListener('loadedmetadata', () => {
  document.getElementById('totalTime').textContent = formatTime(audio.duration);
});
audio.addEventListener('timeupdate', () => {
  if(Number.isFinite(audio.duration) && audio.duration > 0) seekBar.value = (audio.currentTime/audio.duration)*100;
  document.getElementById('currentTime').textContent = formatTime(audio.currentTime);
});
seekBar.addEventListener('input', () => {
  if(Number.isFinite(audio.duration)) audio.currentTime = (seekBar.value/100)*audio.duration;
});
document.getElementById('volumeBar').addEventListener('input', e => audio.volume = Number(e.target.value));
audio.volume = 0.85;

function formatTime(seconds){
  if(!Number.isFinite(seconds)) return '0:00';
  const m = Math.floor(seconds/60);
  const s = Math.floor(seconds%60).toString().padStart(2,'0');
  return `${m}:${s}`;
}

renderTracks();
