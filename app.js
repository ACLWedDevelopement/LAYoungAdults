// ---------- PLAYLIST ----------
const playlist = [
  { src: "./Audio/1_ave_maria.mp3", title: "Ave Maria" },
  { src: "./Audio/2_the_good_song.mp3", title: "The Good Song" },
];

let currentTrack = 0;
let isPlaying = false;

let lastClickedMenuBtn = null;

// ---------------- GET ELEMENTS ----------------
const bookContainer = document.getElementById("book-container");
const book = document.getElementById("book");
const bookRight = document.getElementById("book-right");
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

const overlay = document.getElementById("gallery-overlay");
const overlayImg = document.getElementById("gallery-image");
const overlayClose = document.getElementById("gallery-close");
const zoomHint = document.getElementById("zoom-hint");

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
// ---------- INITIAL SETUP ----------
audio.src = playlist[currentTrack].src;
audio.load();
trackTitle.textContent = "Play me";

// ---------- HELPER FUNCTIONS ----------
function safePlay() {
  if (!audio.src) {
    audio.src = playlist[currentTrack].src;
    audio.load();
  }
  audio.play().catch((err) => console.warn("Audio play failed:", err));
}

function updatePlayButton() {
  playIcon.style.display = isPlaying ? "none" : "block";
  pauseIcon.style.display = isPlaying ? "block" : "none";
  playToggle.setAttribute("aria-pressed", isPlaying);
  playToggle.setAttribute(
    "aria-label",
    isPlaying ? "Pause music" : "Play music",
  );
}

function playCurrentTrack() {
  safePlay();
  trackTitle.textContent = playlist[currentTrack].title;
  isPlaying = true;
  updatePlayButton();
}

function pauseCurrentTrack() {
  audio.pause();
  isPlaying = false;
  updatePlayButton();
}

function togglePlay() {
  if (isPlaying) {
    pauseCurrentTrack();
  } else {
    playCurrentTrack();
  }
}

function nextTrack() {
  currentTrack = (currentTrack + 1) % playlist.length;
  audio.src = playlist[currentTrack].src;
  audio.load();
  playCurrentTrack();
}

// ---------- EVENT LISTENERS ----------

// PLAY/PAUSE - click + keyboard
playToggle.addEventListener("click", togglePlay);
playToggle.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault(); // prevents scrolling
    togglePlay();
  }
});

// SKIP - click + keyboard
skipBtn.addEventListener("click", nextTrack);
skipBtn.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    nextTrack();
  }
});

// AUTO-ADVANCE
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
      btn.dataset.target === id ? "true" : "false",
    );
  });

  bookRight.setAttribute("aria-labelledby", `${id}-heading`);
}

// Button wiring
templateButtons.forEach((button) => {
  button.setAttribute("aria-pressed", "false");

  button.addEventListener("click", () => {
    showTemplate(button.dataset.target);

    lastClickedMenuBtn = button;
    showTemplate(button.dataset.target);
  });

  const anyActive = Array.from(templates).some((t) => !t.hidden);
  if (!anyActive && lastClickedMenuBtn) {
    lastClickedMenuBtn.focus();
  }
});

// Gallery Overlay

let lastFocusedElement = null;

function openGallery(src, alt = "") {
  lastFocusedElement = document.activeElement;

  overlayImg.src = src;
  overlayImg.alt = alt;
  overlay.classList.add("active");
  overlay.setAttribute("aria-hidden", "false");

  overlay.removeAttribute("inert");
  overlay.style.display = "block";
  overlayClose.focus();
}

function closeGallery() {
  overlay.classList.remove("active");
  overlayImg.classList.remove("zoomed");
  overlayImg.src = "";
  overlay.setAttribute("aria-hidden", "true");

  overlay.setAttribute("inert", "");
  overlay.style.display = "none";

  if (lastFocusedElement) {
    lastFocusedElement.focus();
  }
}

// Close actions
overlayClose.addEventListener("click", closeGallery);
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) closeGallery();
});

overlay.addEventListener("keydown", (e) => {
  if (e.key === "Tab") {
    e.preventDefault();
    overlayClose.focus(); // simple single-focus trap for now
  }
});

// Optional: Esc key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeGallery();
});

overlayImg.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    overlayImg.classList.toggle("zoomed");
    zoomHint.classList.add("hidden");
  }
});

overlayImg.addEventListener("click", (e) => {
  e.stopPropagation(); // don't close overlay
  overlayImg.classList.toggle("zoomed");
});

overlayImg.addEventListener("click", () => {
  zoomHint.classList.add("hidden");
});
