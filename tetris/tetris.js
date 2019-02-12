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
  gamePanelStyle.width = '200px';
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

  this.x = 0;
  this.y = 0;
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
  var cell = document.getElementsByClassName('row' + y)[0].getElementsByClassName('col' + x)[0];
  cell.style.backgroundColor = color;
}

// 게임 맵 상태를 갱신한다.
function updateMap(x, y, color) {
  if(color === VACANT) {
    currentGameInfo.piecesMap[y][x].located = false;
  } else {
    currentGameInfo.piecesMap[y][x].located = true;
  }
  currentGameInfo.piecesMap[y][x].color = color;
}

//블록을 아래로 이동한다.
Piece.prototype.moveDown = function() {
  this.unDraw();
  if(!this.isCollision(0, 1, this.activeTetromino)) {
    this.y++;
  }
  this.draw();
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

document.addEventListener('keydown', function() {
  if(event.keyCode == 37) {
    p.moveLeft();
  } else if(event.keyCode == 38)  {
    // p.rotate();
  } else if(event.keyCode == 39)  {
    p.moveRight();
  } else if(event.keyCode == 40)  {
    p.moveDown();
  }
});

function GameInfo() {
  this.piecesMap;
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

var panelRow = 20;
var panelColume = 10;
var currentGameInfo = new GameInfo();
currentGameInfo.init(panelRow, panelColume);
initDisplayGamePanel(panelColume, panelRow);

var p = new Piece(pieces[0][0], pieces[0][1]);
p.draw();