# 개발일지

## 190210

- [Tetris Game Using JavaScript](https://youtu.be/HEsAr2Yt2do)를 보면서 실제로 테트리스를 구현해 보았다. [(구현 코드)](https://github.com/seungyeop-lee/tetris/tree/master/example-tetris)
- 구현을 하면서 충돌판단, 회전, 줄 없애기, 블록 고정에 대한 구현방법에 대해 배울 수 있었다.

### 예제의 테트리스 코드 분석

- 특징
  - canvas로 구현하였다.
  - 블록의 유무를 색으로 구분하였다.
- 장점
  - 블록이 좌우벽에 맞닿아있는 상태에서 회전이 가능하다.
- 단점
  - space를 눌러 한번에 내려보내는 기능이 없다.
  - 메소드의 분리가 덜 되있다. (특히 `lock()`메소드)
  - 현재의 게임 상태 정보가 흩어져있다.