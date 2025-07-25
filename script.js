const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const resetBtn = document.getElementById("resetBtn");
const startBtn = document.getElementById("startBtn");
const player1Input = document.getElementById("player1");
const scoreX = document.getElementById("scoreX");
const scoreO = document.getElementById("scoreO");

const clickSound = document.getElementById("clickSound");
const winSound = document.getElementById("winSound");
const drawSound = document.getElementById("drawSound");

let board = Array(9).fill("");
let currentPlayer = "X";
let gameActive = false;
let player1 = "Player 1", player2 = "AI";
let scores = { X: 0, O: 0 };

const winPatterns = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function handleClick(e) {
  const index = e.target.dataset.index;
  if (board[index] || !gameActive || currentPlayer === "O") return;

  markCell(index, currentPlayer);
  if (checkGameOver()) return;

  currentPlayer = "O";
  statusText.textContent = `${player2}'s Turn`;

  setTimeout(() => {
    const aiMove = getBestMove();
    markCell(aiMove, "O");
    checkGameOver();
    currentPlayer = "X";
    statusText.textContent = `${player1}'s Turn`;
  }, 500);
}

function markCell(index, player) {
  board[index] = player;
  cells[index].textContent = player;
  cells[index].classList.add("marked");
  clickSound.play();
}

function checkGameOver() {
  for (const pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[b] === board[c]) {
      statusText.textContent = `${board[a] === "X" ? player1 : player2} Wins!`;
      scores[board[a]]++;
      updateScoreboard();
      winSound.play();
      gameActive = false;
      return true;
    }
  }

  if (board.every(cell => cell)) {
    statusText.textContent = "It's a Draw!";
    drawSound.play();
    gameActive = false;
    return true;
  }

  return false;
}

function getBestMove() {
  let bestScore = -Infinity, move;
  for (let i = 0; i < 9; i++) {
    if (board[i] === "") {
      board[i] = "O";
      let score = minimax(board, 0, false);
      board[i] = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

function minimax(board, depth, isMax) {
  const winner = evaluate();
  if (winner !== null) return winner;

  if (isMax) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === "") {
        board[i] = "O";
        best = Math.max(best, minimax(board, depth + 1, false));
        board[i] = "";
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === "") {
        board[i] = "X";
        best = Math.min(best, minimax(board, depth + 1, true));
        board[i] = "";
      }
    }
    return best;
  }
}

function evaluate() {
  for (const [a, b, c] of winPatterns) {
    if (board[a] && board[a] === board[b] && board[b] === board[c]) {
      return board[a] === "O" ? 1 : -1;
    }
  }
  return board.includes("") ? null : 0;
}

function updateScoreboard() {
  scoreX.textContent = `X: ${scores.X}`;
  scoreO.textContent = `O: ${scores.O}`;
}

function resetGame() {
  board = Array(9).fill("");
  cells.forEach(cell => {
    cell.textContent = "";
    cell.classList.remove("marked");
  });
  gameActive = true;
  currentPlayer = "X";
  statusText.textContent = `${player1}'s Turn`;
}

function startGame() {
  player1 = player1Input.value.trim() || "Player 1";
  player2 = "AI";
  scores = { X: 0, O: 0 };
  updateScoreboard();
  resetGame();
}

resetBtn.addEventListener("click", resetGame);
startBtn.addEventListener("click", startGame);
cells.forEach(cell => cell.addEventListener("click", handleClick));
