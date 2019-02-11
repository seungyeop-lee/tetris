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
    currentGameInfo.piecesMap[y][x]['located'] = false;
  } else {
    currentGameInfo.piecesMap[y][x]['located'] = true;
  }
  currentGameInfo.piecesMap[y][x]['color'] = color;
}

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

var row = 20;
var colume = 10;
var currentGameInfo = new GameInfo();
currentGameInfo.init(row, colume);
initDisplayGamePanel(colume, row);

var p = new Piece(pieces[0][0], pieces[0][1]);
p.draw();
debugger;
p.unDraw();
debugger;