'use strict';

const playerFactory = (name, shape) => {
  this.name = name;
  this.shape = shape;
  return { name, shape };
};

const GameBoard = (() => {
  const cells = Array.from(document.querySelectorAll('.cell'));

  let board = ['', '', '', '', '', '', '', '', ''];

  const winningRows = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

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
        console.log(board);
        activePlayer = activePlayer === 0 ? 1 : 0;
      }
    }
  });
})();
