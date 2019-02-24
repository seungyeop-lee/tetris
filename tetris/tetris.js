// 블록 종류와 색
var pieces = [
  [Z, 'red'],
  [S, 'green'],
  [T, 'yellow'],
  [O, 'blue'],
  [L, 'purple'],
  [I, 'cyan'],
  [J, 'orange']
];

// 빈 블록 색 지정
var VACANT = 'white';

/**
 * 테트리스 게임 판낼을 생성 후 브라우저에 표시한다.
 * @param {number} xSize 가로 블록 갯수
 * @param {number} ySize 세로 블록 갯수
 */
function initDisplayGamePanel(xSize, ySize) {
  //게임 판에 해당하는 테이블 Element 생성
  var gamePanel = document.createElement('table');
  
  for(var y = 0; y < ySize; ++y) {
    
    var row = document.createElement('tr');
    row.className = 'row' + y;
    for(var x = 0; x < xSize; ++x) {
      
      var cell = document.createElement('td');
      cell.className = 'col' + x;
      cell.style.border = '1px solid black';
      cell.style.backgroundColor = 'white';
      row.appendChild(cell);
    }
    gamePanel.appendChild(row);
  }
  
  //스타일 및 속성 지정
  var gamePanelStyle = gamePanel.style;
  gamePanelStyle.border = '1px solid black';
  gamePanelStyle.borderCollapse = 'collapse';
  gamePanelStyle.height = '500px';
  gamePanelStyle.width = '250px';
  gamePanel.id = 'game-panel';
  
  //화면에 추가
  var gamePanelDiv = document.getElementById('game-panel-div');
  gamePanelDiv.appendChild(gamePanel);
}

/**
 * 블럭 조각 한개를 나타낸다.
 * @param {Array[tetrominoN][row][col]} tetromino 
 * @param {string} color 
 */
function Piece(tetromino, color) {
  this.tetromino = tetromino;
  this.color = color;

  this.tetrominoN = 0;
  this.activeTetromino = this.tetromino[this.tetrominoN];

  this.x = panelColume/2-2;
  this.y = -2;
}

// 블럭을 그린다.
Piece.prototype.draw = function() {
  this.update(this.color);
}

// 블럭을 지운다.
Piece.prototype.unDraw = function() {
  this.update(VACANT);
}

// 블럭 상태를 업데이트한다.
Piece.prototype.update = function(color) {
  for(var row = 0; row < this.activeTetromino.length; row++) {
    for(var col = 0; col < this.activeTetromino.length; col++) {
      if(this.activeTetromino[row][col]) {
        drawSquare(this.x + col, this.y + row, color);
        updateMap(this.x + col, this.y + row, color);
      }
    }
  }
}

// 블럭을 화면에 표시한다.
function drawSquare(x, y, color) {
  if(y < 0) {
    return;
  }
  var cell = document.getElementsByClassName('row' + y)[0].getElementsByClassName('col' + x)[0];
  cell.style.backgroundColor = color;
}

// 게임 맵 상태를 갱신한다.
function updateMap(x, y, color) {
  if(y < 0) {
    return;
  }
  if(color === VACANT) {
    currentGameInfo.piecesMap[y][x].located = false;
  } else {
    currentGameInfo.piecesMap[y][x].located = true;
  }
  currentGameInfo.piecesMap[y][x].color = color;
}

//블록을 내려갈 수 있는 가장 아래로 이동한다.
Piece.prototype.moveEndDown = function() {
  this.unDraw();
  while(!this.isCollision(0, 1, this.activeTetromino)) {
    this.y++;
  }
  this.moveDown();
}

//블록을 아래로 이동한다.
Piece.prototype.moveDown = function() {
  this.unDraw();
  if(!this.isCollision(0, 1, this.activeTetromino)) {
    this.y++;
    this.draw();
  } else {
    this.lock();
    if(gameOver) {
      window.clearInterval(interval);
      document.removeEventListener('keydown', keyboardEventHandler);
      window.setTimeout(function() {
        alert('Game Over!');
      }, 0);
    } else {
      this.removeRow();
      p = randomPiece();
    }
  }
}

//블록은 오른쪽으로 이동한다.
Piece.prototype.moveRight = function() {
  this.unDraw();
  if(!this.isCollision(1, 0, this.activeTetromino)) {
    this.x++;
  }
  this.draw();
}

//블록을 왼쪽으로 이동한다.
Piece.prototype.moveLeft = function() {
  this.unDraw();
  if(!this.isCollision(-1, 0, this.activeTetromino)) {
    this.x--;
  }
  this.draw();
}

//다 채워진 행을 삭제한다.
Piece.prototype.removeRow = function() {
  var removedRowCount = 0;
  for(var r = 0; r < panelRow; r++) {
    if(removedRowCount >= 4) {
      return;
    }
    var isRowFull = true;
    for(var c = 0; c < panelColume; c++) {
      isRowFull = isRowFull && (currentGameInfo.piecesMap[r][c].located);
    }
    if(isRowFull) {
        // 모든 행을 한칸 아래로 이동시킨다.
        for(var y = r; y > 1; y--) {
          for(var c = 0; c < panelColume; c++) {
            drawSquare(c, y, currentGameInfo.piecesMap[y-1][c].color);
            updateMap(c, y, currentGameInfo.piecesMap[y-1][c].color);
          }
        }
        // 가장 마지막 행은 빈칸으로 채운다.
        for(var c = 0; c < panelColume; c++) {
          drawSquare(c, 0, VACANT);
          updateMap(c, 0, VACANT);
        }
        removedRowCount++;
    }
  }
}

//블록을 회전시킨다.
Piece.prototype.rotate = function() {
  var nextPattern = this.tetromino[(this.tetrominoN + 1) % this.tetromino.length];
  var kick = 0;

  this.unDraw();

  //회전했을 때 충돌 유무 판단
  if(this.isCollision(0, 0, nextPattern)) {
    if(this.x > panelColume/2) {
      //패널의 오른쪽에 위치
      kick = -1;  //블록을 왼쪽으로 한칸 옮긴다.
    } else {
      //패널의 왼쪽에 위치
      kick = 1; //블록을 오른쪽으로 한칸 옮긴다.
    }
  }

  if(!this.isCollision(kick, 0, nextPattern)) {
    this.x += kick;
    this.tetrominoN = (this.tetrominoN + 1) % this.tetromino.length;  // (0+1)%4 == 1
    this.activeTetromino = this.tetromino[this.tetrominoN];
  }
  this.draw();
}

//블록을 고정시킨다.
Piece.prototype.lock = function() {
  for(var row = this.activeTetromino.length - 1; 0 <= row; row--) {
    for(var col = this.activeTetromino.length - 1; 0 <= col; col--) {
      //블록의 빈부분은 계산하지 않는다.
      if(!this.activeTetromino[row][col]) {
        continue;
      }
      
      //블록을 그 자리에 고정시킨다.
      drawSquare(this.x + col, this.y + row, this.color);
      updateMap(this.x + col, this.y + row, this.color);

      //블록의 일부라도 위쪽 판넬을 넘어갈경우 확인
      if(this.y + row < 0) {
        gameOver = true;
        return;
      }
    }
  }
}

//충돌여부를 판단한다.
Piece.prototype.isCollision = function(x, y, piece) {
  for(var row = 0; row < piece.length; row++) {
    for(var col = 0; col < piece.length; col++) {
      //블록의 빈부분은 계산하지 않는다.
      if(piece[row][col] === 0) {
        continue;
      }

      //x, y만큼 움직였을 때의 좌표 설정
      var newX = this.x + col + x;
      var newY = this.y + row + y;

      //판넬을 넘어갈경우 확인(좌, 우, 아래)
      if(newX < 0 || newX >= panelColume || newY >= panelRow) {
        return true;
      }

      //판넬을 넘어갈경우 확인(위)
      //위로 넘어갈 경우 GameOver이므로 일단은 패스
      if(newY < 0) {
        continue;
      }

      //이동하려는 좌표에 블록이 존재하는지 확인
      if(currentGameInfo.piecesMap[newY][newX].located) {
        return true;
      }
    }
  }
  return false;
}

function keyboardEventHandler(e) {
  if(currentGameInfo.started === false) {
    currentGameInfo.started = true;
    play();
    return;
  }

  if(e.keyCode == 32) {
    p.moveEndDown();
  } else if(e.keyCode == 37) {
    p.moveLeft();
  } else if(e.keyCode == 38)  {
    p.rotate();
  } else if(e.keyCode == 39)  {
    p.moveRight();
  } else if(e.keyCode == 40)  {
    p.moveDown();
  }
}

document.addEventListener('keydown', keyboardEventHandler);

function GameInfo() {
  this.piecesMap;
  this.started = false;
}

GameInfo.prototype.init = function(row, col) {
  var piecesMap = [];
  for(var currRow = 0; currRow < row; currRow++) {
    piecesMap[currRow] = [];
    for(var currCol = 0; currCol < col; currCol++) {
      piecesMap[currRow][currCol] = {
        located: false,
        color: VACANT
      };
    }
  }
  this.piecesMap = piecesMap;
}

// 랜덤하게 블럭을 생성
function randomPiece() {
  var r = Math.floor(Math.random() * pieces.length);  // 0 ~ 6
  return new Piece(pieces[r][0], pieces[r][1]);
}

var panelRow = 20;
var panelColume = 10;
var currentGameInfo = new GameInfo();
currentGameInfo.init(panelRow, panelColume);
initDisplayGamePanel(panelColume, panelRow);

var p;
var interval;
var gameOver = false;

function play() {
  p = randomPiece();
  p.draw();
  interval = window.setInterval(function() {
    p.moveDown();
  }, 1000);
}