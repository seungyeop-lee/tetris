//현재 게임정보 객체 저장 변수
var cGameInfo;

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
  if(cGameInfo.started === false) {
    cGameInfo.started = true;
    startPlay();
    return;
  }

  if(e.keyCode == 32) {
    cGameInfo.cPiece.moveEndDown();
  } else if(e.keyCode == 37) {
    cGameInfo.cPiece.moveLeft();
  } else if(e.keyCode == 38)  {
    cGameInfo.cPiece.rotate();
  } else if(e.keyCode == 39)  {
    cGameInfo.cPiece.moveRight();
  } else if(e.keyCode == 40)  {
    cGameInfo.cPiece.moveDown();
  }
}

document.addEventListener('keydown', keyboardEventHandler);

function GameInfo() {
  this.panelRow = 20;
  this.panelColume = 10;

  this.piecesMap;
  this.cPiece;

  this.started = false;
  this.gameOver = false;
  this.dropIntervalTime = 1000;
  this.accelateIntervalTime = 10000;
  this.dropIntervalId;
}

function initPiecesMap(row, col) {
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
  cGameInfo.piecesMap = piecesMap;
}

// 랜덤하게 블럭을 생성
function randomPiece() {
  var r = Math.floor(Math.random() * pieces.length);  // 0 ~ 6
  return new Piece(pieces[r][0], pieces[r][1]);
}

cGameInfo = new GameInfo();
function startPlay() {
  initPiecesMap(cGameInfo.panelRow, cGameInfo.panelColume);
  initDisplayGamePanel(cGameInfo.panelColume, cGameInfo.panelRow);
  cGameInfo.cPiece = randomPiece();
  cGameInfo.cPiece.draw();
  setDropInterval();
  setPlayInterval();
}

function setPlayInterval() {
  if(cGameInfo.gameOver === false) {
    window.setTimeout(function() {
      cGameInfo.cPiece.moveDown();
      setPlayInterval();
    }, cGameInfo.dropIntervalTime);
  }
}

function setDropInterval() {
  cGameInfo.dropIntervalId = window.setInterval(function() {
    if(cGameInfo.dropIntervalTime > 200) {
      cGameInfo.dropIntervalTime -= 100;
    }
  }, cGameInfo.accelateIntervalTime);
}