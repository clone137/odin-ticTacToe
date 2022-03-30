'use strict';

const playerFactory = (name, shape) => {
  this.name = name;
  this.shape = shape;
  return { name, shape };
};

const GameBoard = (() => {
  const cells = Array.from(document.querySelectorAll('.cell'));

  let board = ['', '', '', '', '', '', '', '', ''];

  function _addPlayers() {
    const player1 = playerFactory('player1', 'close');
    const player2 = playerFactory('player2', 'circle');
    return [player1, player2];
  }

  const players = _addPlayers();
  let activePlayer = 0;

  cells.forEach((cell, index) => {
    // add handlers for mouse events around the board
    if (!board[index]) {
      cell.addEventListener('mouseenter', _handleMouseEnter);
      cell.addEventListener('mouseleave', _handleMouseLeave);
      cell.addEventListener('click', _handleClick, false);
    }

    function _handleMouseEnter(e) {
      e.preventDefault();
      if (!e.target.classList.contains('set')) {
        e.target.innerHTML = `<span class="material-icons-outlined md-96">${players[activePlayer].shape}</span>`;
        e.target.classList.add('hover');
      }
    }

    function _handleMouseLeave(e) {
      e.preventDefault();
      if (!e.target.classList.contains('set')) {
        e.target.innerHTML = '';
        e.target.classList.remove('hover');
      }
    }

    function _handleClick(e) {
      e.preventDefault();
      // if (!e.target.classList.contains('set')) {
      if (!cell.classList.contains('set')) {
        cell.classList.add('set');
        cell.classList.remove('hover');
        cell.removeEventListener('mouseenter', _handleMouseEnter);
        cell.removeEventListener('mouseleave', _handleMouseLeave);
        cell.removeEventListener('click', _handleClick);
        board[index] = players[activePlayer].shape;

        const winningMove = _checkForWin(players[activePlayer].shape);
        if (winningMove) {
          console.log(`${activePlayer} wins with winning move: ${winningMove}`);
          winningMove.forEach((winningCell) => {
            cells[winningCell].classList.add('win');
          });
        }
        activePlayer = activePlayer === 0 ? 1 : 0;
      }
    }

    function _checkForWin(shape) {
      // check rows
      for (let i = 0; i < 3; i++) {
        console.log(`found a row: ${i}`);
        if (
          board[i * 3] == shape &&
          board[i * 3 + 1] == shape &&
          board[i * 3 + 2] == shape
        )
          return [i * 3, i * 3 + 1, i * 3 + 2];
      }

      // check columns
      for (let i = 0; i < 3; i++) {
        console.log(`found a column: ${i}`);
        if (board[i] == shape && board[i + 3] == shape && board[i + 6] == shape)
          return [i, i + 3, i + 6];
      }

      // check diagonals
      if (board[0] == shape && board[4] == shape && board[8] == shape)
        return [0, 4, 8];

      if (board[2] == shape && board[4] == shape && board[6] == shape)
        return [2, 4, 6];

      return false;
    }
  });
})();
