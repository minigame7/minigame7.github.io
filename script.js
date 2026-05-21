const startScreen = document.getElementById("start-screen");
const endScreen = document.getElementById("end-screen");
const startBtn = document.getElementById("start-btn");
const balloonContainer = document.getElementById("balloon-container");
const scoreboard = document.getElementById("scoreboard");
const timeDisplay = document.getElementById("time");
const scoreDisplay = document.getElementById("score");
const finalScoreDisplay = document.getElementById("final-score");

let gameInterval;
let timeInterval;
let timeLeft = 30;
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

  // Pick a random item from the array
  const randomItem = items[Math.floor(Math.random() * items.length)];

  const el = document.createElement("div");
  el.classList.add("balloon"); // keeps your existing CSS/animation

  // Create an image element using the item's image file
  const img = document.createElement("img");
  img.src = randomItem.image;
  img.alt = randomItem.name;
  img.style.width = "100%";
  img.style.height = "100%";
  img.style.objectFit = "contain";
  img.draggable = false;

  el.appendChild(img);

  el.style.top = Math.random() * (window.innerHeight - 100) + "px";

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

  gameInterval = setInterval(createItem, 400); // updated function name

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

  const gameoverAudio = document.getElementById("gameover-audio");
  gameoverAudio.play();
  
  scoreboard.style.display = "none";
  endScreen.style.display = "flex";
  finalScoreDisplay.textContent = score;
}

startBtn.addEventListener("click", startGame);