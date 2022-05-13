'use strict';

const playerFactory = (name, shape) => {
  this.name = name;
  this.shape = shape;
  return { name, shape };
};

const GameBoard = (() => {
  const cells = Array.from(document.querySelectorAll('.cell'));
  const statusMessage = document.querySelector('#statusMessage');
  const resetButton = document.querySelector('#resetButton');

  const players = _addPlayers();
  let activePlayer = 0;
  let gameOver = 0;

  function _handleReset(e) {
    e.preventDefault();
    activePlayer = 0;
    gameOver = 0;
    _resetBoard();
  }
  resetButton.addEventListener('click', _handleReset);

  let board = ['', '', '', '', '', '', '', '', ''];

  function _addPlayers() {
    const player1 = playerFactory('player1', 'close');
    const player2 = playerFactory('player2', 'circle');
    return [player1, player2];
  }

  function _handleMouseEnter(e) {
    e.preventDefault();
    if (!e.target.classList.contains('set') && gameOver !== 1) {
      e.target.innerHTML = `<span class="material-icons-outlined md-96">${players[activePlayer].shape}</span>`;
      e.target.classList.add('hover');
    }
  }

  function _handleMouseLeave(e) {
    e.preventDefault();
    if (!e.target.classList.contains('set') && gameOver !== 1) {
      e.target.innerHTML = '';
      e.target.classList.remove('hover');
    }
  }

  function _checkForWin(shape) {
    // check rows
    for (let i = 0; i < 3; i++) {
      if (
        board[i * 3] == shape &&
        board[i * 3 + 1] == shape &&
        board[i * 3 + 2] == shape
      )
        return [i * 3, i * 3 + 1, i * 3 + 2];
    }

    // check columns
    for (let i = 0; i < 3; i++) {
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

  function _handleClick(event, cell, index) {
    event.preventDefault();
    if (!cell.classList.contains('set') && gameOver !== 1) {
      cell.classList.add('set');
      cell.classList.remove('hover');
      cell.removeEventListener('mouseenter', _handleMouseEnter);
      cell.removeEventListener('mouseleave', _handleMouseLeave);
      cell.removeEventListener('click', _handleClick);
      board[index] = players[activePlayer].shape;

      const winningMove = _checkForWin(players[activePlayer].shape);
      if (winningMove) {
        statusMessage.innerHTML = `<h1>Player ${activePlayer + 1} wins</h1>`;
        console.log(
          `Player ${activePlayer + 1} wins with winning move: ${winningMove}`
        );
        gameOver = 1;
        winningMove.forEach((winningCell) => {
          cells[winningCell].classList.add('win');
        });
        cells.forEach((cell) => {
          cell.removeEventListener('mouseenter', _handleMouseEnter);
          cell.removeEventListener('mouseleave', _handleMouseLeave);
          cell.removeEventListener('click', _handleClick);
          cell.style.cursor = 'default';
        });
      }

      if (!winningMove && !board.includes('')) {
        statusMessage.innerText = `<h1>no one wins, it's a tie!</h1>`;
        console.log(`no one wins, it's a tie!`);
      }
      activePlayer = activePlayer === 0 ? 1 : 0;
    }
  }

  function _resetBoard() {
    board = ['', '', '', '', '', '', '', '', ''];
    cells.forEach((cell, index) => {
      cell.removeEventListener('mouseenter', _handleMouseEnter);
      cell.removeEventListener('mouseleave', _handleMouseLeave);
      cell.removeEventListener('click', _handleClick);

      const handleClick = (event) => _handleClick(event, cell, index);
      // add handlers for mouse events around the board
      cell.addEventListener('mouseenter', _handleMouseEnter);
      cell.addEventListener('mouseleave', _handleMouseLeave);
      cell.addEventListener('click', handleClick, false);
      cell.classList.remove('set');
      cell.classList.remove('win');
      cell.innerHTML = '';
      cell.style.cursor = 'pointer';
      statusMessage.innerHTML = `<h1>Game in progress...</h1>`;
    });
  }

  _resetBoard();
})();
