// Tutorial als Basis: https://www.codeexplained.org/2018/08/create-tetris-game-using-javascript.html

const cvs = document.getElementById("tetris");
const ctx = cvs.getContext("2d");

const nextcvs = document.getElementById("next");
const nextctx = nextcvs.getContext("2d");

const scoreElement = document.getElementById("score");
const levelElement = document.getElementById("level");
const notepadElement = document.getElementById("notepad");

const ROW = 20;
const COL = (COLUMN = 10);
const NEXT_COL = 6;
const NEXT_ROW = 4;
const ROLL_COL = 10;
const ROLL_ROW = 4;
const squareSize = 22;
const empty = "black"; //colour
let tetrominoSequence = [];

//define ids
const avocado = "avocado";
const salmon = "salmon";
const rice = "rice";
const nori = "nori";
const ikura = "ikura";
const tamago = "tamago";
const tuna = "tuna";
const cucumber = "cucumber";

let score = 0;
let level = 1;
let dropStart = Date.now();
let gameOver = false;
let isPaused = true;

document.addEventListener("keydown", CONTROL);

function drawImageSquare(x, y, imagePath) {
  if (imagePath == empty) {
    ctx.fillStyle = empty;
    ctx.fillRect(x * squareSize, y * squareSize, squareSize, squareSize);

    ctx.strokeStyle = "grey";
    ctx.strokeWeight = 0.2;
    ctx.strokeRect(x * squareSize, y * squareSize, squareSize, squareSize);
  } else {
    ctx.drawImage(
      document.getElementById(imagePath),
      x * squareSize,
      y * squareSize,
      squareSize,
      squareSize
    );
  }
}

let board = [];
for (r = 0; r < ROW; r++) {
  board[r] = [];
  for (c = 0; c < COL; c++) {
    board[r][c] = empty; // r&c wie i&j in Matrix-IndexSchreibweise
  }
}

function drawBoard() {
  for (r = 0; r < ROW; r++) {
    for (c = 0; c < COL; c++) {
      drawImageSquare(c, r, board[r][c]);
    }
  }
}
drawBoard();

//nextboard
function drawNextImageSquare(x, y, imagePath) {
  if (imagePath == empty) {
    nextctx.fillStyle = empty;
    nextctx.fillRect(x * squareSize, y * squareSize, squareSize, squareSize);
    nextctx.strokeStyle = "grey";
    nextctx.strokeWeight = 0.2;
    nextctx.strokeRect(x * squareSize, y * squareSize, squareSize, squareSize);
  } else {
    nextctx.drawImage(
      document.getElementById(imagePath),
      x * squareSize,
      y * squareSize,
      squareSize,
      squareSize
    );
  }
}

let nextboard = [];
for (r = 0; r < NEXT_ROW; r++) {
  nextboard[r] = [];
  for (c = 0; c < NEXT_COL; c++) {
    nextboard[r][c] = empty; // r&c wie i&j in Matrix-IndexSchreibweise
  }
}

function drawNextBoard() {
  for (r = 0; r < NEXT_ROW; r++) {
    for (c = 0; c < NEXT_COL; c++) {
      drawNextImageSquare(c, r, nextboard[r][c]);
    }
  }
}
drawNextBoard();


const PIECES = [
  [Z, salmon, "Z"],
  [S, avocado, "S"],
  [T, rice, "T"],
  [O, tamago, "O"],
  [L, nori, "L"],
  [I, cucumber, "I"],
  [J, tuna, "J"],
  [o, ikura, "o"]
];

function getLevelSequence() {
  var sequence = [];
  if (level == 1) {
    sequence = ["I", "o", "Z", "L", "J", "O", "S", "T"];
  } else if (level == 2) {
    sequence = [
      "I",
      "J",
      "J",
      "L",
      "L",
      "L",
      "O",
      "S",
      "S",
      "T",
      "T",
      "T",
      "Z",
      "Z",
      "o"
    ];
  } else if (level == 3) {
    sequence = [
      "I",
      "J",
      "J",
      "L",
      "L",
      "O",
      "S",
      "S",
      "T",
      "T",
      "Z",
      "Z",
      "o"
    ];
  }
  return sequence;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateSequence() {
  let sequence = getLevelSequence();
  while (sequence.length) {
    const randomId = getRandomInt(0, sequence.length - 1);
    const name = sequence.splice(randomId, 1)[0];
    tetrominoSequence.push(name);
  }
  console.log(tetrominoSequence);
}

function createRandomPiece() {
  if (tetrominoSequence.length == 0) {
    generateSequence();
  }
  let takenElement = tetrominoSequence.pop();
  let randomElement = PIECES.find(z => z[2] == takenElement);
  let p1 = new Piece(randomElement[0], randomElement[1]);
  return p1;
  // for (i in PIECES){
  // if (PIECES[i][2]==takenElement){
  //     let randomElement=PIECES[i]
  //     let p1 = new Piece(randomElement[0], randomElement[1]);
  //     return p1;
  // }}
}

function createRandomNextPiece() {
  drawNextBoard();
  let p2 = createRandomPiece();
  p2.drawNext();
  return p2;
}

function Piece(tetromino, imagePath) {
  this.tetromino = tetromino;
  this.imagePath = imagePath;

  this.tetrominoN = 0;
  this.activeTetromino = this.tetromino[this.tetrominoN];

  this.x = 3; //distance from start of board
  this.y = -2;
}

Piece.prototype.fill = function(imagePath) {
  for (r = 0; r < this.activeTetromino.length; r++) {
    for (c = 0; c < this.activeTetromino.length; c++) {
      if (this.activeTetromino[r][c]) {
        //fill squares with 1 in matrix
        drawImageSquare(this.x + c, this.y + r, imagePath);
      }
    }
  }
};

Piece.prototype.fillNext = function(imagePath) {
  for (r = 0; r < this.activeTetromino.length; r++) {
    for (c = 0; c < this.activeTetromino.length; c++) {
      if (this.activeTetromino[r][c]) {
        //fill squares with 1 in matrix
        drawNextImageSquare(1 + c, 1 + r, imagePath);
      }
    }
  }
};

Piece.prototype.draw = function() {
  this.fill(this.imagePath);
};

Piece.prototype.unDraw = function() {
  this.fill(empty);
};

//next
Piece.prototype.drawNext = function() {
  this.fillNext(this.imagePath);
};

Piece.prototype.moveDown = function() {
  if (!this.collision(0, 1, this.activeTetromino)) {
    // y=1 da activetetromino vor newY
    this.unDraw();
    this.y++;
    this.draw();
  } else {
    this.lock();
    // p = createRandomPiece();
    p = pNext;
    pNext = createRandomNextPiece();
  }
};

Piece.prototype.moveRight = function() {
  if (!this.collision(1, 0, this.activeTetromino)) {
    // x=1 da activetetromino sich nach newX befindet
    this.unDraw();
    this.x++;
    this.draw();
  }
};

Piece.prototype.moveLeft = function() {
  if (!this.collision(-1, 0, this.activeTetromino)) {
    // x=-1 da activetetromino sich vor newX befindet
    this.unDraw();
    this.x--;
    this.draw();
  }
};

Piece.prototype.rotate = function() {
  let nextPattern = this.tetromino[
    (this.tetrominoN + 1) % this.tetromino.length
  ]; // % ist nix anderes als modulo
  //zb. modulo4 ist (n+1)%4

  let kick = 0;

  if (this.collision(0, 0, nextPattern)) {
    if (this.x > COL / 2) {
      kick = -1;
    } else {
      kick = 1;
    }
  }

  if (!this.collision(kick, 0, nextPattern)) {
    // kick as x um zu sehen ob nach kick keine collision stattfindet
    this.unDraw();
    this.x += kick;
    this.tetrominoN = (this.tetrominoN + 1) % this.tetromino.length; // (0+1)%4 => 1
    this.activeTetromino = this.tetromino[this.tetrominoN];
    this.draw();
  }
};

Piece.prototype.lock = function() {
  for (r = 0; r < this.activeTetromino.length; r++) {
    for (c = 0; c < this.activeTetromino.length; c++) {
      if (!this.activeTetromino[r][c]) {
        continue;
      }

      if (this.y + r < 0) {
        var s = confirm("My bad, you lost the Game\n\nWanna try again?");
        if (s === true) {
          location.reload();
        } else {
        }
        gameOver = true;
        break;
      }
      board[this.y + r][this.x + c] = this.imagePath;
    }
  }

  for (r = 0; r < ROW; r++) {
    let isRowFull = true;
    let rowElements = [];
    for (c = 0; c < COL; c++) {
      isRowFull = isRowFull && board[r][c] != empty;
      rowElements.push(board[r][c]);
    }
    if (isRowFull) {
      if (!rowElements.find(i => i == "rice")) {
        break;
      } else {
        let finalElements=eraseDuplicates(rowElements);  
        console.log("finalElements are:", finalElements);
        console.log("rice vorhanden");  
        if(rowElements.find(i=>i == "nori")){
            score+=20;
            console.log("nori vorhanden");
        }else{
            score += 10;
        }
        
        notepadElement.innerHTML+="<ul><li>"+" "+finalElements+"</li></ul>";


        if (score >= 50) {
          level = 2;
          tetrominoSequence = [];
        }
        if (score >= 120) {
          level = 3;
          tetrominoSequence = [];
        }
        
        for (y = r; y > 1; y--) {
          for (c = 0; c < COL; c++) {
            board[y][c] = board[y - 1][c];
          }
        }

        for (c = 0; c < COL; c++) {
          board[0][c] = empty;
        }
      }
    }
  }
  drawBoard();
  scoreElement.innerHTML = score;
  levelElement.innerHTML = level;
}

function eraseDuplicates(arr){
    let uniqueElements = [];
    arr.forEach(element => {
        if(!uniqueElements.find(u => u == element)){
            uniqueElements.push(element);
        }
    });
    return uniqueElements;
}


Piece.prototype.collision = function(x, y, piece) {
  for (r = 0; r < piece.length; r++) {
    for (c = 0; c < piece.length; c++) {
      if (!piece[r][c]) {
        continue;
      }

      let newX = this.x + c + x;
      let newY = this.y + r + y;

      if (newX < 0 || newX >= COL || newY >= ROW) {
        return true;
      }
      // skip newY < 0, damits nichts crasht da kein index mit -1
      if (newY < 0) {
        continue;
      }

      if (board[newY][newX] != empty) {
        return true;
      }
    }
  }
  return false;
};

let p = createRandomPiece();
let pNext = createRandomNextPiece();

function CONTROL(event) {
  if (isPaused) {
    return;
  }
  if (event.keyCode == 37) {
    p.moveLeft();
    dropStart = Date.now();
  } else if (event.keyCode == 38) {
    p.rotate();
    dropStart = Date.now();
  } else if (event.keyCode == 39) {
    p.moveRight();
    dropStart = Date.now();
  } else if (event.keyCode == 40) {
    p.moveDown();
    dropStart = Date.now();
  }
}

function pauseGame() {
  isPaused = true;
  document.getElementById("play").style.display = "block";
  document.getElementById("pause").style.display = "none";
}

function playGame() {
  isPaused = false;
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("play").style.display = "none";
  document.getElementById("pause").style.display = "block";
  drop();
}

function drop() {
  console.log("drop isPaused", isPaused);
  if (isPaused) {
    return;
  }
  let now = Date.now();
  let delta = now - dropStart;

  if (
    (delta > 1000 && level == 1) ||
    (level == 2 && delta > 500) ||
    (level == 3 && delta > 300)
  ) {
    p.moveDown();
    dropStart = Date.now();
  }
  if (!gameOver) {
    requestAnimationFrame(drop);
  }
}
drop();
