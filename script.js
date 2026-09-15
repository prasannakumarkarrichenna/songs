const PASSWORD = "iloveyou";

function checkPassword() {
  const input = document.getElementById("passwordInput").value;

  if (input === PASSWORD) {
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("mainPage").style.display = "block";
  } else {
    alert("Wrong password 😢");
  }
}

let currentAudio = null;
let currentButton = null;
let currentLyrics = null;
let currentIndex = 0;

function playSong(button) {
  const songDiv = button.parentElement;
  const audio = songDiv.querySelector(".audio");
  const lyrics = songDiv.querySelector(".lyrics");

  const progress = songDiv.querySelector(".progress");
  const currentTimeEl = songDiv.querySelector(".current-time");
  const durationEl = songDiv.querySelector(".duration");

  const bgVideo = document.getElementById("bgVideo");
  const videoSrc = songDiv.getAttribute("data-video");

  // SAME SONG → TOGGLE
  if (currentAudio === audio) {
    if (audio.paused) {
      audio.play();
      bgVideo.play();
      button.innerText = "⏸ Pause";
    } else {
      audio.pause();
      bgVideo.pause();
      button.innerText = "▶ Play";
    }
    return;
  }

  // STOP previous
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }
  if (currentButton) currentButton.innerText = "▶ Play";
  if (currentLyrics) currentLyrics.style.display = "none";

  bgVideo.pause();

  // ✅ SET VIDEO FIRST (IMPORTANT FIX)
  if (videoSrc && bgVideo.src !== videoSrc) {
    bgVideo.src = videoSrc;
    bgVideo.load();
  }

  // PLAY BOTH TOGETHER
  audio.play().then(() => {
    bgVideo.play();
  });

  button.innerText = "⏸ Pause";
  lyrics.style.display = "block";

  currentAudio = audio;
  currentButton = button;
  currentLyrics = lyrics;

  const songs = document.querySelectorAll(".song");
  currentIndex = Array.from(songs).indexOf(songDiv);

  // SET DURATION
  audio.addEventListener("loadedmetadata", () => {
    if (!isNaN(audio.duration)) {
      durationEl.innerText = formatTime(audio.duration);
    }
  });

  // UPDATE PROGRESS
  audio.ontimeupdate = () => {
    if (!isNaN(audio.duration)) {
      const percent = (audio.currentTime / audio.duration) * 100;
      progress.value = percent;
      currentTimeEl.innerText = formatTime(audio.currentTime);
    }
  };

  // SEEK
  progress.oninput = () => {
    if (!isNaN(audio.duration)) {
      audio.currentTime = (progress.value / 100) * audio.duration;
    }
  };

  // AUTO NEXT
  audio.onended = () => {
    playNext();
  };
}

function playNext() {
  const songs = document.querySelectorAll(".song");

  currentIndex++;
  if (currentIndex >= songs.length) return;

  const nextSong = songs[currentIndex];
  const button = nextSong.querySelector("button");

  playSong(button);
}

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return minutes + ":" + (seconds < 10 ? "0" + seconds : seconds);
}