const board = document.querySelector('.board');
const ticTacToeContainer = document.querySelector('.tic-tac-toe-container');
const startButton = document.getElementById('start-button');
const resetButton = document.getElementById('reset-button');
const modeRadios = document.getElementsByName('mode');

const winningConditions = [
    [0, 1, 2], // Top row
    [3, 4, 5], // Middle row
    [6, 7, 8], // Bottom row
    [0, 3, 6], // Left column
    [1, 4, 7], // Middle column
    [2, 5, 8], // Right column
    [0, 4, 8], // Diagonal
    [2, 4, 6]  // Diagonal
  ];
  

let currentPlayer = 'X';
let gameState = ["", "", "", "", "", "", "", "", ""];
let isGameActive = false;
let aiPlayer = 'O'; // AI plays as 'O'
let humanPlayer = 'X'; // Human plays as 'X'
let aiMode = false;
const xImage = 'm.gif'; // Default image for X
const oImage = 'z.gif'; // Default image for O

// Initialize game based on selected mode
startButton.addEventListener('click', () => {
  aiMode = [...modeRadios].find(radio => radio.checked).value === 'ai';
  resetGame();
  ticTacToeContainer.classList.remove('hidden');
});

// Reset game state
resetButton.addEventListener('click', resetGame);

function resetGame() {
  gameState = ["", "", "", "", "", "", "", "", ""];
  isGameActive = true;
  currentPlayer = humanPlayer;
  document.querySelectorAll('.cell').forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('active');
    cell.style.backgroundImage = ''; // Clear background image
  });
}

// Handle click events on the board
board.addEventListener('click', (e) => {
  const index = e.target.dataset.index;

  if (gameState[index] !== "" || !isGameActive) return;

  gameState[index] = currentPlayer;
  e.target.style.backgroundImage = `url('${currentPlayer === 'X' ? xImage : oImage}')`;
  e.target.classList.add('active');

  if (checkWinner()) {
    alert(`Player ${currentPlayer} wins!`);
    isGameActive = false;
  } else if (!gameState.includes("")) {
    alert("It's a tie!");
  } else {
    currentPlayer = currentPlayer === humanPlayer ? aiPlayer : humanPlayer;
    if (currentPlayer === aiPlayer && aiMode) {
      setTimeout(aiMove, 500); // Delay for AI's move
    }
  }
});

// AI move using Minimax algorithm
function aiMove() {
  const bestMove = minimax(gameState, aiPlayer);
  gameState[bestMove.index] = aiPlayer;
  const cell = document.querySelector(`.cell[data-index='${bestMove.index}']`);
  cell.style.backgroundImage = `url('${oImage}')`;
  cell.classList.add('active');

  if (checkWinner()) {
    alert(`AI wins!`);
    isGameActive = false;
  } else if (!gameState.includes("")) {
    alert("It's a tie!");
  } else {
    currentPlayer = humanPlayer;
  }
}

// Minimax algorithm to find the optimal move for AI
function minimax(state, player) {
  let availableSpots = state.map((val, idx) => val === "" ? idx : null).filter(val => val !== null);

  // Check for terminal states
  if (checkWinnerWithState(state, humanPlayer)) return { score: -10 };
  if (checkWinnerWithState(state, aiPlayer)) return { score: 10 };
  if (availableSpots.length === 0) return { score: 0 };

  let moves = [];

  availableSpots.forEach(spot => {
    let move = {};
    move.index = spot;

    state[spot] = player;

    if (player === aiPlayer) {
      let result = minimax(state, humanPlayer);
      move.score = result.score;
    } else {
      let result = minimax(state, aiPlayer);
      move.score = result.score;
    }

    state[spot] = ""; // Reset spot

    moves.push(move);
  });

  let bestMove;
  if (player === aiPlayer) {
    let bestScore = -Infinity;
    moves.forEach(move => {
      if (move.score > bestScore) {
        bestScore = move.score;
        bestMove = move;
      }
    });
  } else {
    let bestScore = Infinity;
    moves.forEach(move => {
      if (move.score < bestScore) {
        bestScore = move.score;
        bestMove = move;
      }
    });
  }

  return bestMove;
}

// Check for a winner using the current state
function checkWinner() {
  return checkWinnerWithState(gameState, currentPlayer);
}

function checkWinnerWithState(state, player) {
  for (let condition of winningConditions) {
    const [a, b, c] = condition;
    if (state[a] && state[a] === player && state[a] === state[b] && state[a] === state[c]) {
      return true;
    }
  }
  return false;
}
