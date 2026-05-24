const startScreen = document.getElementById("start-screen");
const endScreen = document.getElementById("end-screen");
const startBtn = document.getElementById("start-btn");
const balloonContainer = document.getElementById("balloon-container");
const scoreboard = document.getElementById("scoreboard");
const timeDisplay = document.getElementById("time");
const scoreDisplay = document.getElementById("score");
const finalScoreDisplay = document.getElementById("final-score");
const customCursor = document.getElementById("custom-cursor");

document.addEventListener("touchmove", (e) => {
  const touch = e.touches[0];
  customCursor.style.display = "block";
  customCursor.style.left = touch.clientX + "px";
  customCursor.style.top = touch.clientY + "px";
}, { passive: true });

document.addEventListener("touchend", () => {
  customCursor.style.display = "none";
});

let gameInterval;
let timeInterval;
let timeLeft = 45;
let score = 0;

const items = [
  { name: "bowserJr", image: "bowserJr.png" },
  { name: "larry", image: "larry.png" },
  { name: "iggy", image: "iggy.png" },
  { name: "roy", image: "roy.png" },
  { name: "wendy", image: "wendy.png" },
  { name: "morton", image: "morton.png" },
  { name: "lemmy", image: "lemmy.png" },
  { name: "ludwig", image: "ludwig.png" }
];

let gameRunning = false;

function createItem() {
  if (!gameRunning) return;

  const randomItem = items[Math.floor(Math.random() * items.length)];

  const el = document.createElement("div");
  el.classList.add("balloon"); 

  const img = document.createElement("img");
  img.src = randomItem.image;
  img.alt = randomItem.name;
  img.style.width = "100%";
  img.style.height = "100%";
  img.style.objectFit = "contain";
  img.draggable = false;

  el.appendChild(img);

  const padding = 50;
  const randomTop = Math.floor(Math.random() * (window.innerHeight - 100 - padding * 2)) + padding;
  el.style.top = randomTop + "px";

  const duration = Math.random() * 3 + 4;
  el.style.animationDuration = duration + "s";

  el.addEventListener("click", () => {
    el.remove();
    score++;
    scoreDisplay.textContent = score;
  });

  el.addEventListener("animationend", () => {
    el.remove();
  });

  balloonContainer.appendChild(el);
}

function startGame() {
  startScreen.style.display = "none";
  scoreboard.style.display = "block";
  gameRunning = true;

  const bgAudio = document.getElementById("bg-audio");
  bgAudio.play();

  gameInterval = setInterval(createItem, 400); 

  timeInterval = setInterval(() => {
    timeLeft--;
    timeDisplay.textContent = timeLeft;

    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

function endGame() {
  gameRunning = false;
  clearInterval(gameInterval);
  clearInterval(timeInterval);

  const bgAudio = document.getElementById("bg-audio");
  bgAudio.pause();
  bgAudio.currentTime = 0;

  const endTitle = document.getElementById("end-title");
  const endMessage = document.getElementById("end-message");

  if (score >= 40) {
    endTitle.textContent = "You Win!";
    endMessage.textContent = "You defeated enough Koopaling clones to save Mushroom Kingdom";
    document.getElementById("win-audio").play();
  } else {
    endTitle.textContent = "Game Over!";
    endMessage.textContent = "The Koopaling clones have taken over Mushroom Kingdom...";
    document.getElementById("lose-audio").play();
  }

  scoreboard.style.display = "none";
  endScreen.style.display = "flex";
  finalScoreDisplay.textContent = score;
}

startBtn.addEventListener("click", startGame);