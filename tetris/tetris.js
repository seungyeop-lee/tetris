// 블록 종류와 색
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
      cell.style.backgroundColor = 'white';
      row.appendChild(cell);
    }
    gamePanel.appendChild(row);
  }
  
  //스타일 및 속성 지정
  gamePanel.id = 'tetris-panel';
  
  //화면에 추가
  var gamePanelDiv = document.getElementById('tetris-display');
  gamePanelDiv.appendChild(gamePanel);
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
  this.dropIntervalTime = 1000;
  this.accelateIntervalTime = 10000;
  this.dropIntervalId;
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
var gameOver = false;

function play() {
  p = randomPiece();
  p.draw();
  setDropInterval();
  setPlayInterval();
}

function setPlayInterval() {
  if(gameOver === false) {
    window.setTimeout(function() {
      p.moveDown();
      setPlayInterval();
    }, currentGameInfo.dropIntervalTime);
  }
}

function setDropInterval() {
  currentGameInfo.dropIntervalId = window.setInterval(function() {
    if(currentGameInfo.dropIntervalTime > 200) {
      currentGameInfo.dropIntervalTime -= 100;
    }
  }, currentGameInfo.accelateIntervalTime);
}