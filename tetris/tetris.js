//현재 게임정보 객체 저장 변수
var cGameInfo;

//게임 시작 함수
function startPlay() {
  cGameInfo = new GameInfo();
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

/**
 * 게임 정보를 생성하는 생성자 함수
 */
function GameInfo() {
  this.panelRow = 20;
  this.panelColume = 10;

  this.piecesMap;
  this.cPiece;  //현재 블록
  this.nPiece;  //다음 블록

  this.started = true;
  this.gameOver = false;
  this.dropIntervalTime = 1000; //초기 속도, 1초에 1tick을 의미
  this.accelateIntervalTime = 10000;  //가속 간격, 10초를 의미
  this.dropIntervalId;

  this.mobile = navigator.userAgent.match(/Android|Mobile|iP(hone|od|ad)|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/);

  //게임 속도 표시
  this.gameSpeedTag = document.getElementById('game-speed');
  this.changeSpeedDisplay = function() {
    this.gameSpeedTag.innerHTML = this.dropIntervalTime / 1000 + " sec/pick";
  }
  this.changeSpeedDisplay();

  //스코어 표시
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

//게임화면 부분을 표시한다.
function initScreen() {
  document.getElementById('start-screen').style.display = "none";
  document.getElementById('outer-game-screen').style.display = "flex";
  document.getElementById('game-over-screen').style.display = "none";
}

/**
 * 게임 판넬의 정보를 저장 할 배열을 초기화한다.
 * @param {number} row 
 * @param {number} col 
 */
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

/**
 * 다음 블럭 표시부분을 생성 후 브라우저에 표시한다.
 */
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

//현재블록과 다음블록을 설정한다.
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

// 랜덤하게 블럭을 생성
function randomPiece() {
  var r = Math.floor(Math.random() * pieces.length);  // 0 ~ 6
  return new Piece(pieces[r][0], pieces[r][1], pieces[r][2]);
}

//가속 간격마다 0.1초씩 내려오는 속도를 높인다. 최대속도 0.2 sec/tick
function setDropInterval() {
  cGameInfo.dropIntervalId = window.setInterval(function() {
    if(cGameInfo.dropIntervalTime > 200) {
      cGameInfo.dropIntervalTime -= 100;
      cGameInfo.changeSpeedDisplay();
    }
  }, cGameInfo.accelateIntervalTime);
}

//게임 속도에 따라 블록을 움직인다.
function setPlayInterval() {
  if(cGameInfo.gameOver === false) {
    window.setTimeout(function() {
      cGameInfo.cPiece.moveDown();
      setPlayInterval();
    }, cGameInfo.dropIntervalTime);
  }
}

//키보드 이벤트 리스너
function keyboardEventHandler(e) {
  //space 키
  if(e.keyCode == 32) {
    cGameInfo.cPiece.moveEndDown();
  //왼쪽 화살표
  } else if(e.keyCode == 37) {
    cGameInfo.cPiece.moveLeft();
  //위쪽 화살표
  } else if(e.keyCode == 38)  {
    cGameInfo.cPiece.rotate();
  //오른쪽 화살표
  } else if(e.keyCode == 39)  {
    cGameInfo.cPiece.moveRight();
  //아래 화살표
  } else if(e.keyCode == 40)  {
    cGameInfo.cPiece.moveDown();
  }
}

//모바일 전용 버튼 표시 및 비표시 함수
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

//줌인, 줌아웃 제스쳐 무효화 이벤트 리스너
function preventZoomInOut(e) {
  e = e.originalEvent || e;
  if (e.scale !== 1) {
     e.preventDefault();
  }
}

//게임아웃 화면 표시
function goGameOverScreen() {
  document.getElementById('game-over-screen').style.display = "flex";
}

//게임 재시작
function restartGame() {
  startPlay();
}

//초기 화면 표시
function goStartUp() {
  document.getElementById('start-screen').style.display = "flex";
  document.getElementById('outer-game-screen').style.display = "none";
  document.getElementById('game-over-screen').style.display = "none";
}