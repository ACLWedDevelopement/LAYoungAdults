// ---------- PLAYLIST ----------
const playlist = [
  { src: "./audio/1_ave_maria.mp3", title: "Ave Maria" },
  { src: "./audio/2_the_good_song.mp3", title: "The Good Song" },
];

let currentTrack = 0;
let isPlaying = false;

// ---------------- GET ELEMENTS ----------------
const bookContainer = document.getElementById("book-container");
const book = document.getElementById("book");
const toggleWrapper = document.getElementById("book-toggle");
const showIcon = document.getElementById("show");
const hideIcon = document.getElementById("hide");
const bookClose = document.getElementById("book-close");
const templates = document.querySelectorAll("[data-template]");
const templateButtons = document.querySelectorAll("[data-target]");

const audio = document.getElementById("music-player");
const playToggle = document.getElementById("play-toggle");
const playIcon = document.getElementById("play");
const pauseIcon = document.getElementById("pause");
const skipBtn = document.getElementById("skip");
const trackTitle = document.getElementById("track-title");

// ---------------- SHOW / HIDE BOOK ----------------
function toggleBookVisibility() {
  const isHiding = !bookContainer.classList.contains("book-hidden");
  bookContainer.classList.toggle("book-hidden");

  if (isHiding) {
    bookContainer.classList.replace("book_expanded", "book_normal");
    hideIcon.style.display = "none";
    showIcon.style.display = "block";
  } else {
    hideIcon.style.display = "block";
    showIcon.style.display = "none";
  }
}

toggleWrapper.addEventListener("click", toggleBookVisibility);
toggleWrapper.addEventListener("keypress", (e) => {
  if (e.key === "Enter" || e.key === " ") toggleBookVisibility();
});

// ---------------- EXPAND / COLLAPSE BOOK ----------------
book.addEventListener("click", () => {
  if (bookContainer.classList.contains("book_normal")) {
    bookContainer.classList.replace("book_normal", "book_expanded");
  }
});

bookClose.addEventListener("click", (e) => {
  e.stopPropagation();
  bookContainer.classList.replace("book_expanded", "book_normal");
});

// ---------------- MUSIC FUNCTIONS ----------------
trackTitle.textContent = "Play me";
audio.src = playlist[currentTrack].src;
audio.load();

function safePlay() {
  if (!audio.src) {
    audio.src = playlist[currentTrack].src;
    audio.load();
  }
  audio.play().catch((err) => console.warn("Audio play failed:", err));
}

// ---------- PLAY / PAUSE ----------
function togglePlay() {
  if (!isPlaying) {
    safePlay();
    playIcon.style.display = "none";
    pauseIcon.style.display = "block";
    trackTitle.textContent = playlist[currentTrack].title;
    isPlaying = true;
  } else {
    audio.pause();
    pauseIcon.style.display = "none";
    playIcon.style.display = "block";
    isPlaying = false;
  }
}

playToggle.addEventListener("click", togglePlay);
playToggle.addEventListener("keypress", (e) => {
  if (e.key === "Enter" || e.key === " ") togglePlay();
});

// ---------- SKIP ----------
function nextTrack() {
  currentTrack = (currentTrack + 1) % playlist.length;
  audio.src = playlist[currentTrack].src;
  audio.load();
  safePlay();
  trackTitle.textContent = playlist[currentTrack].title;
  playIcon.style.display = "none";
  pauseIcon.style.display = "block";
  isPlaying = true;
}

skipBtn.addEventListener("click", nextTrack);
skipBtn.addEventListener("keypress", (e) => {
  if (e.key === "Enter" || e.key === " ") nextTrack();
});

// ---------- AUTO-ADVANCE ----------
audio.addEventListener("ended", nextTrack);

// ---------- RIGHT PAGE TEMPLATE SWITCHING ----------

function showTemplate(id) {
  templates.forEach((section) => {
    const isActive = section.id === id;

    section.hidden = !isActive;

    if (isActive) {
      // Move focus for screen readers + keyboard users
      section.setAttribute("tabindex", "-1");
      section.focus({ preventScroll: true });
    }
  });

  // Update pressed state for buttons
  templateButtons.forEach((btn) => {
    btn.setAttribute(
      "aria-pressed",
      btn.dataset.target === id ? "true" : "false"
    );
  });
}

// Button wiring
templateButtons.forEach((button) => {
  button.setAttribute("aria-pressed", "false");

  button.addEventListener("click", () => {
    showTemplate(button.dataset.target);
  });
});
