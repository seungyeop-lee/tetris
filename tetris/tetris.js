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
  gamePanelDiv.innerHTML = "";
  gamePanelDiv.appendChild(gamePanel);
}

function keyboardEventHandler(e) {
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

function GameInfo() {
  this.panelRow = 20;
  this.panelColume = 10;

  this.piecesMap;
  this.cPiece;
  this.nPiece;

  this.started = false;
  this.gameOver = false;
  this.dropIntervalTime = 1000;
  this.accelateIntervalTime = 10000;
  this.dropIntervalId;

  this.mobile = navigator.userAgent.match(/Android|Mobile|iP(hone|od|ad)|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/);

  this.gameSpeedTag = document.getElementById('game-speed');
  this.changeSpeedDisplay = function() {
    this.gameSpeedTag.innerHTML = this.dropIntervalTime / 1000 + " sec/pick";
  }
  this.changeSpeedDisplay();

  this.score = 0;
  this.gameScoreTag = document.getElementById('game-info-score');
  this.gameOverScoreTag = document.getElementById('game-over-score');
  this.updateScore = function(removedRowCount) {
    switch (removedRowCount) {
      case 0:
        break;
      case 1:
        this.score += 100;
        break;
      case 2:
        this.score += 200;
        break;
      case 3:
        this.score += 400;
        break;
      case 4:
        this.score += 600;
        break;
      default:
        console.log('unexpected removedRowCount: ' + removedRowCount);
        break;
    }
    this.gameScoreTag.innerHTML = this.score;
    this.gameOverScoreTag.innerHTML = "SCORE: " + this.score;
  }
  this.updateScore(0);
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
  return new Piece(pieces[r][0], pieces[r][1], pieces[r][2]);
}

function startPlay() {
  cGameInfo = new GameInfo();
  cGameInfo.started = true;
  initScreen();
  initPiecesMap(cGameInfo.panelRow, cGameInfo.panelColume);
  initDisplayGamePanel(cGameInfo.panelColume, cGameInfo.panelRow);
  initNextBlockInfo();
  setNextPieces();
  setDropInterval();
  setPlayInterval();
  document.addEventListener('keydown', keyboardEventHandler);
  setControleButton();
}

function setNextPieces() {
  if(cGameInfo.nPiece) {
    cGameInfo.cPiece = cGameInfo.nPiece;
  } else {
    cGameInfo.cPiece = randomPiece();
  }
  cGameInfo.cPiece.draw();
  cGameInfo.nPiece = randomPiece();
  cGameInfo.nPiece.nbDraw();
}

function initScreen() {
  document.getElementById('start-screen').style.display = "none";
  document.getElementById('outer-game-screen').style.display = "flex";
  document.getElementById('game-over-screen').style.display = "none";
}

function setControleButton() {
  var buttons = document.getElementById('outer-game-screen').getElementsByTagName('button');
  if(cGameInfo.mobile && cGameInfo.started && !cGameInfo.gameOver) {
    Array.from(buttons).forEach(function(button) {
      button.style.display = "inline-block";
      button.addEventListener('touchmove', preventZoomInOut, false);
    });
  } else {
    Array.from(buttons).forEach(function(button) {
      button.style.display = "none";
      button.removeEventListener('touchmove', preventZoomInOut, false);
    });
  }
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
      cGameInfo.changeSpeedDisplay();
    }
  }, cGameInfo.accelateIntervalTime);
}

function goGameOverScreen() {
  document.getElementById('game-over-screen').style.display = "flex";
}

function restartGame() {
  startPlay();
}

function goStartUp() {
  document.getElementById('start-screen').style.display = "flex";
  document.getElementById('outer-game-screen').style.display = "none";
  document.getElementById('game-over-screen').style.display = "none";
}

function initNextBlockInfo() {
  var nextBlockInfoTable = document.createElement('table');
  nextBlockInfoTable.id = 'next-block';

  for(var row = 0; row < 4; ++row) {
    var tr = document.createElement('tr');
    tr.className = "nbRow" + row;
    
    for(var col = 0; col < 4; ++col) {
      var cell = document.createElement('td');
      cell.className = "nbCol" + col;
      cell.style.backgroundColor = 'white';
      tr.appendChild(cell);
    }

    nextBlockInfoTable.appendChild(tr);
  }
  
  var nextBlockInfo = document.getElementById('next-block-info');
  if(nextBlockInfo.childElementCount > 1) {
    nextBlockInfo.lastElementChild.remove();
  }
  nextBlockInfo.appendChild(nextBlockInfoTable);
}

function preventZoomInOut(e) {
  e = e.originalEvent || e;
  if (e.scale !== 1) {
     e.preventDefault();
  }
}