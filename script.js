const startScreen = document.getElementById("start-screen");
const endScreen = document.getElementById("end-screen");
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
let spawnTimeout; 
let timeLeft = 45;
let score = 0;
let totalItemsSpawned = 0;
let totalItemsClicked = 0;
let lives = 5;
const CLASSIC_TOTAL = 45;

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
let gameMode = "arcade";

document.getElementById("arcade-btn").addEventListener("click", () => {
  gameMode = "arcade";
  startGame();
});

document.getElementById("classic-btn").addEventListener("click", () => {
  gameMode = "classic";
  startGame();
});

function spawnItem(el) {
  const randomItem = items[Math.floor(Math.random() * items.length)];

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
}

function createItem() {
  if (!gameRunning) return;

  const el = document.createElement("div");
  el.classList.add("balloon");
  spawnItem(el);

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

function createItemClassic() {
  if (!gameRunning) return;
  if (totalItemsSpawned >= CLASSIC_TOTAL) return;

  totalItemsSpawned++;

  const el = document.createElement("div");
  el.classList.add("balloon");
  spawnItem(el);

  const speedFactor = 1 - (totalItemsSpawned / CLASSIC_TOTAL) * 0.6;
  const duration = (Math.random() * 2 + 5) * speedFactor;
  el.style.animationDuration = duration + "s";

  el.addEventListener("click", () => {
    el.remove();
    totalItemsClicked++;
    score++;
    scoreDisplay.textContent = score;
    if (totalItemsClicked >= CLASSIC_TOTAL) endGame("win");
  });

  el.addEventListener("animationend", () => {
    if (!el.isConnected) return;
    el.remove();
    lives--;
    updateLives();
    if (lives <= 0) {
      endGame("lose");
    }
  });

  balloonContainer.appendChild(el);
}

function scheduleNextClassicItem(spawnInterval) {
  if (!gameRunning) return;
  if (totalItemsSpawned >= CLASSIC_TOTAL) return;

  spawnTimeout = setTimeout(() => {
    createItemClassic();
    const nextInterval = Math.max(600, spawnInterval - 25);
    scheduleNextClassicItem(nextInterval);
  }, spawnInterval);
}
function updateLives() {
  const livesDisplay = document.getElementById("lives-display");
  livesDisplay.innerHTML = "";

  for (let i = 0; i < 5; i++) {
    const img = document.createElement("img");
    img.src = i < lives ? "fullHeart.png" : "emptyHeart.png";
    img.style.width = "35px";
    img.style.height = "35px";
    img.style.marginRight = "4px";
    livesDisplay.appendChild(img);
  }
}

function startGame() {
  // Reset state
  score = 0;
  timeLeft = 45;
  totalItemsSpawned = 0;
  totalItemsClicked = 0;
  scoreDisplay.textContent = 0;
  timeDisplay.textContent = 45;

  startScreen.style.display = "none";
  scoreboard.style.display = "block";
  gameRunning = true;
  document.getElementById("bg-audio").play();

  if (gameMode === "arcade") {
    document.getElementById("time-display").style.display = "inline";
    document.getElementById("lives-display").style.display = "none";
    document.getElementById("time-display").style.display = "inline";
    gameInterval = setInterval(createItem, 400);
    timeInterval = setInterval(() => {
      timeLeft--;
      timeDisplay.textContent = timeLeft;
      if (timeLeft <= 0) endGame("lose");
    }, 1000);
  } else {
    document.getElementById("time-display").style.display = "none";
    lives = 5;
    updateLives();
    document.getElementById("lives-display").style.display = "inline";
    document.getElementById("time-display").style.display = "none";
    scheduleNextClassicItem(1800);
  }
}

function endGame(result = "lose") {
  gameRunning = false;
  clearInterval(gameInterval);
  clearInterval(timeInterval);
  clearTimeout(spawnTimeout);

  balloonContainer.innerHTML = "";

  const bgAudio = document.getElementById("bg-audio");
  bgAudio.pause();
  bgAudio.currentTime = 0;

  const endTitle = document.getElementById("end-title");
  const endMessage = document.getElementById("end-message");

  if (gameMode === "arcade") {
    if (score >= 40) {
      endTitle.textContent = "Victory!";
      endMessage.textContent = "You defeated enough Koopaling clones to save Mushroom Kingdom!";
      document.getElementById("win-audio").play();
    } else {
      endTitle.textContent = "Game Over!";
      endMessage.textContent = "The Koopalings have taken over Mushroom Kingdom...";
      document.getElementById("lose-audio").play();
    }
  } else {
    if (result === "win") {
      endTitle.textContent = "Victory!";
      endMessage.textContent = "You defeated all the Koopaling clones and saved Mushroom Kingdom!";
      document.getElementById("win-audio").play();
    } else {
      endTitle.textContent = "Game Over!";
      endMessage.textContent = "Too many Koopaling clones escaped! Mushroom Kingdom is doomed...";
      document.getElementById("lose-audio").play();
    }
  }

  scoreboard.style.display = "none";
  endScreen.style.display = "flex";
  finalScoreDisplay.textContent = score;
}