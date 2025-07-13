const grid = document.getElementById("grid");
const cipherClue = document.getElementById("cipher-clue");
const message = document.getElementById("message");
const timerEl = document.getElementById("timer");
const scoreEl = document.getElementById("score");

let hiddenTiles = [];
let gridSize = 5;
let tilesToReveal = 5;
let revealed = false;
let timer = 0;
let timerInterval;
let score = 0;
let patternHint = "";

function startGame() {
  const difficulty = document.getElementById("difficulty").value;
  grid.innerHTML = "";
  cipherClue.textContent = "";
  message.textContent = "";
  score = 0;
  timer = 0;
  revealed = false;
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timer++;
    timerEl.textContent = timer;
  }, 1000);

  switch (difficulty) {
    case "easy":
      tilesToReveal = 4;
      break;
    case "medium":
      tilesToReveal = 6;
      break;
    case "hard":
      tilesToReveal = 8;
      break;
  }

  generateGrid();
  hiddenTiles = generatePattern();
  patternHint = generateCipher(hiddenTiles);
  cipherClue.textContent = `Ciphered Hint: ${patternHint}`;

  revealPattern();
}

function generateGrid() {
  for (let i = 0; i < gridSize * gridSize; i++) {
    const tile = document.createElement("div");
    tile.classList.add("tile");
    tile.dataset.index = i;
    tile.addEventListener("click", handleTileClick);
    grid.appendChild(tile);
  }
}

function generatePattern() {
  const set = new Set();
  while (set.size < tilesToReveal) {
    set.add(Math.floor(Math.random() * gridSize * gridSize));
  }
  return [...set];
}

function generateCipher(indices) {
  const letters = indices.map(i => String.fromCharCode(65 + i));
  const ciphered = letters.map(ch => String.fromCharCode(ch.charCodeAt(0) + 2)); // Caesar +2
  return ciphered.join("-");
}

function revealPattern() {
  revealed = true;
  hiddenTiles.forEach(i => {
    const tile = document.querySelector(`[data-index='${i}']`);
    tile.classList.add("reveal");
  });

  setTimeout(() => {
    hiddenTiles.forEach(i => {
      const tile = document.querySelector(`[data-index='${i}']`);
      tile.classList.remove("reveal");
    });
    revealed = false;
  }, 3000);
}

function handleTileClick(e) {
  if (revealed) return;

  const index = parseInt(e.target.dataset.index);
  const tile = e.target;

  if (hiddenTiles.includes(index)) {
    tile.classList.add("correct");
    score += 10;
  } else {
    tile.classList.add("wrong");
    score -= 5;
  }

  tile.removeEventListener("click", handleTileClick);
  scoreEl.textContent = score;

  checkWin();
}

function checkWin() {
  const correctTiles = document.querySelectorAll(".tile.correct").length;
  if (correctTiles === hiddenTiles.length) {
    clearInterval(timerInterval);
    message.textContent = `🎉 You cracked the Cipher Storm! Time: ${timer}s | Score: ${score}`;
  }
}
