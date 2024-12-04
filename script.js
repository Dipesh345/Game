const bird = document.getElementById("bird");
const pipeContainer = document.getElementById("pipe-container");
const pipes = document.querySelectorAll(".pipe");
const scoreElement = document.getElementById("score");
const startGameButton = document.getElementById("start-game");
const tryAgainButton = document.getElementById("try-again");

let birdTop = 45; // Bird's vertical position (percentage)
let pipeSpeed = 2; // Pipe movement speed
let isGameOver = false;
let score = 0;
let gameInterval = null; // Reference to the game loop
let gravityInterval = null; // Reference to gravity effect

// Add jump control
document.body.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" && !isGameOver) {
    birdTop -= 8; // Jump up
    bird.style.top = `${birdTop}%`;
  }
});

function startGame() {
  startGameButton.style.display = "none";
  tryAgainButton.style.display = "none";
  isGameOver = false;
  birdTop = 45;
  score = 0;
  pipeContainer.style.right = "0";
  randomizePipes();
  scoreElement.textContent = `Score: ${score}`;

  // Gravity effect
  gravityInterval = setInterval(() => {
    birdTop += 1; // Gradual fall
    bird.style.top = `${birdTop}%`;
  }, 30);

  // Main game loop
  gameInterval = setInterval(gameLoop, 30);
}

function gameLoop() {
  if (isGameOver) return;

  // Move the pipes
  const currentRight = parseInt(pipeContainer.style.right || 0);
  pipeContainer.style.right = `${currentRight + pipeSpeed}px`;

  if (currentRight >= 100) {
    pipeContainer.style.right = "0";
    randomizePipes();
    score++;
    scoreElement.textContent = `Score: ${score}`;
  }

  // Check collisions
  const birdBounds = bird.getBoundingClientRect();
  const upperPipeBounds = pipes[0].getBoundingClientRect();
  const lowerPipeBounds = pipes[1].getBoundingClientRect();
  const containerBounds = document
    .getElementById("game-container")
    .getBoundingClientRect();

  if (
    birdBounds.top < containerBounds.top || // Ceiling collision
    birdBounds.bottom > containerBounds.bottom || // Ground collision
    (birdBounds.right > upperPipeBounds.left &&
      birdBounds.left < upperPipeBounds.right &&
      birdBounds.top < upperPipeBounds.bottom) || // Upper pipe collision
    (birdBounds.right > lowerPipeBounds.left &&
      birdBounds.left < lowerPipeBounds.right &&
      birdBounds.bottom > lowerPipeBounds.top) // Lower pipe collision
  ) {
    endGame();
  }
}

function randomizePipes() {
  const upperHeight = Math.random() * 40 + 20; // Random height (20% - 60%)
  const gap = 20; // Gap between pipes in percentage

  pipes[0].style.height = `${upperHeight}%`;
  pipes[1].style.height = `${100 - upperHeight - gap}%`;
}

function endGame() {
  clearInterval(gameInterval);
  clearInterval(gravityInterval);
  isGameOver = true;
  tryAgainButton.style.display = "block";
}

function resetGame() {
  birdTop = 45;
  score = 0;
  isGameOver = false;
  scoreElement.textContent = `Score: ${score}`;
  pipeContainer.style.right = "0";
  randomizePipes();
  startGame();
}

// Initialize the game with pipes
randomizePipes();
