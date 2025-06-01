const boardElement = document.getElementById("board"); //container
const statusText = document.getElementById("status"); //messages

let board = Array(9).fill(""); // Empty 3x3 board
let currentPlayer = "X"; // You start
let gameActive = true;  // Game state

const winPatterns = [
  [0, 1, 2], [3, 4, 5],[6, 7, 8], // Rows
  [0, 3, 6],[1, 4, 7],[2, 5, 8],  // Columns
  [0, 4, 8],[2, 4, 6], // Diagonals
];

function renderBoard() {
  boardElement.innerHTML = "";
  for (let i = 0; i < board.length; i++) {
    const cellEl = document.createElement("div");
    cellEl.classList.add("cell");
    cellEl.textContent = board[i];
    cellEl.addEventListener("click", () => handleMove(i));
    boardElement.appendChild(cellEl);
  }
}


function handleMove(index) {
  if (!gameActive || board[index] !== "") return;


  board[index] = currentPlayer;  // Put "X" in the cell
  renderBoard();

  if (checkWinner(board, currentPlayer)) {
    statusText.textContent = `${currentPlayer} wins!`;
    gameActive = false;
    return;
  }

  // Check for tie by looking for any empty cell
  let isTie = true;
  for (let i = 0; i < board.length; i++) {
    if (board[i] === "") {
      isTie = false;
      break;
    }
  }
  if (isTie) {
    statusText.textContent = "It's a tie!";
    gameActive = false;
    return;
  }


  currentPlayer = "O";
  statusText.textContent = "AI is thinking...";
  setTimeout(() => {
    let bestMove = getBestMove(board); // best possible move for the AI
    board[bestMove] = currentPlayer;
    renderBoard();
    
    if (checkWinner(board, currentPlayer)) {
      statusText.textContent = `${currentPlayer} (AI) wins!`;
      gameActive = false;
      return;
    }

    // Check for tie by looking for any empty cell
    let isTie = true;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === "") {
        isTie = false;
        break;
      }
    }
    if (isTie) {
      statusText.textContent = "It's a tie!";
      gameActive = false;
      return;
    }

    currentPlayer = "X";
    statusText.textContent = "Your turn! (X)";
  }, 500);
}

function checkWinner(b, player) {
  // Check each winning pattern
  for (let i = 0; i < winPatterns.length; i++) {
    let pattern = winPatterns[i];
    let hasWon = true;
    
    // Check if all positions in the pattern match the player
    for (let j = 0; j < pattern.length; j++) {
      if (b[pattern[j]] !== player) {
        hasWon = false;
        break;
      }
    }
    
    // If all positions match, we found a winner
    if (hasWon) {
      return true;
    }
  }
  return false;
}


function getBestMove(board) {
  let bestScore = -Infinity;
  let bestMove;
  
  for (let i = 0; i < board.length; i++) {
    if (board[i] === "") {
      board[i] = "O";                // Try this move
      let score = minimax(board, 0, false);  // Simulate game
      board[i] = "";                 // Undo move
      if (score > bestScore) {       // Keep track of best move
        bestScore = score;
        bestMove = i;
      }
    }
  }
  return bestMove;
}


function minimax(board, depth, isMaximizing) {  // Check for terminal states
  if (checkWinner(board, "O")) return 10 - depth;     // AI wins(positive score)
  if (checkWinner(board, "X")) return depth - 10;     // Human wins(negative score)
  
  // Check for tie
  let isTie = true;
  for (let i = 0; i < board.length; i++) {
    if (board[i] === "") {
      isTie = false;
      break;
    }
  }
  if (isTie) return 0;     // Tie

  if (isMaximizing) {
    // AI's turn (trying to get the highest score)
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === "") {
        board[i] = "O";                               // Make move
        let score = minimax(board, depth + 1, false); // Human's turn
        board[i] = "";                                // Undo move
        bestScore = Math.max(score, bestScore);       // Choose best score
      }
    }
    return bestScore;
  } else {
    // Human's turn (trying to minimize AI's score)
    let bestScore = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === "") {
        board[i] = "X";                               // Make move
        let score = minimax(board, depth + 1, true);  // AI's turn next
        board[i] = "";                                // Undo move
        bestScore = Math.min(score, bestScore);       // Choose lowest score
      }
    }
    return bestScore;
  }
}

function restartGame() {
  board = Array(9).fill("");
  currentPlayer = "X";
  gameActive = true;
  statusText.textContent = "Your turn! (X)";
  renderBoard();
}

renderBoard();
