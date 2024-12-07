const introContainer = document.getElementById('intro');
const gameContainer = document.getElementById('game');
const board = document.getElementById('game-board');
const statusDisplay = document.getElementById('status');
const restartButton = document.getElementById('restart-btn');
const reloadButton = document.getElementById('reload-btn'); // New reload button

let gameActive = true;
let currentPlayer = 'X';
let gameState = ['', '', '', '', '', '', '', '', '', ''];
let mode = '';

const winningConditions = [
   [0, 1, 2],
   [3, 4, 5],
   [6, 7, 8],
   [0, 3, 6],
   [1, 4, 7],
   [2, 5, 8],
   [0, 4, 8],
   [2, 4, 6],
];

document.getElementById('player-vs-player').addEventListener('click', () => {
   mode = 'PvP';
   startGame();
});

document.getElementById('player-vs-computer').addEventListener('click', () => {
   mode = 'PvC';
   startGame();
});

// Event listener for the reload button
reloadButton.addEventListener('click', () => {
   location.reload(); // Reloads the current page
});

function startGame() {
   introContainer.style.display = 'none';
   gameContainer.style.display = 'block';
   createBoard();
   resetGame();
}

function createBoard() {
   board.innerHTML = ''; // Clear previous board
   for (let i = 0; i < 9; i++) {
       const cell = document.createElement('div');
       cell.classList.add('cell');
       cell.setAttribute('data-cell-index', i);
       cell.addEventListener('click', handleCellClick);
       board.appendChild(cell);
   }
}

function handleCellClick(event) {
   const clickedCell = event.target;
   const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

   if (gameState[clickedCellIndex] !== '' || !gameActive) {
       return;
   }

   gameState[clickedCellIndex] = currentPlayer;
   clickedCell.innerHTML = currentPlayer;

   checkResult();

   if (mode === 'PvC' && gameActive) {
       computerPlay();
   }
}

function checkResult() {
   let roundWon = false;

   for (let i = 0; i < winningConditions.length; i++) {
       const [a, b, c] = winningConditions[i];
       if (gameState[a] === '' || gameState[b] === '' || gameState[c] === '') {
           continue;
       }
       if (gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
           roundWon = true;
           break;
       }
   }

   if (roundWon) {
       statusDisplay.innerHTML = `Player ${currentPlayer} has won!`;
       gameActive = false;
       return;
   }

   // Check for a draw
   if (!gameState.includes('') && !roundWon) {
       statusDisplay.innerHTML = 'Game ended in a draw!';
       gameActive = false;
       return;
   }

   currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

function computerPlay() {
   const bestMove = minimax(gameState, currentPlayer);
   gameState[bestMove.index] = currentPlayer;

   document.querySelector(`.cell[data-cell-index='${bestMove.index}']`).innerHTML = currentPlayer;

   // Check the result after the computer's move
   checkResult();
}

function minimax(newGameState, player) {
   const availableCells = newGameState.map((cell, index) => cell === '' ? index : null).filter(index => index !== null);

   if (checkWinner(newGameState, 'X')) {
       return { score: -10 };
   } else if (checkWinner(newGameState, 'O')) {
       return { score: +10 };
   } else if (availableCells.length === 0) {
       return { score: +0 }; // Draw
   }

   const moves = [];

   for (let i = 0; i < availableCells.length; i++) {
       const move = {};
       move.index = availableCells[i];
       newGameState[availableCells[i]] = player;

       if (player === 'O') { // AI's turn
           const result = minimax(newGameState, 'X');
           move.score = result.score;

       } else { // Player's turn
           const result = minimax(newGameState, 'O');
           move.score = result.score;

       }

       newGameState[availableCells[i]] = ''; // Undo the move
       moves.push(move);
   }

   let bestMove;

if (player === 'O') { // AI's turn
      let bestScore = -Infinity;

      for (let i = 0; i < moves.length; i++) {

         if (moves[i].score > bestScore) {

            bestScore = moves[i].score;

            bestMove = moves[i];

         }
      }
} else { // Player's turn
      let bestScore = Infinity;

      for (let i = 0; i < moves.length; i++) {

         if (moves[i].score < bestScore) {

            bestScore = moves[i].score;

            bestMove = moves[i];

         }
      }
}
return bestMove;

}

function checkWinner(currentState, player) {
return winningConditions.some(condition => 
condition.every(index => currentState[index] === player)
);
}

function resetGame() {
gameActive = true;
// Resetting the state of the game.
currentPlayer = 'X';
gameState.fill('');
statusDisplay.innerHTML = '';
document.querySelectorAll('.cell').forEach(cell => cell.innerHTML = '');
}

// Add event listener for restart button
restartButton.addEventListener('click', resetGame);