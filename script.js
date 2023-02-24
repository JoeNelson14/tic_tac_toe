
/////////////////// MODULES ///////////////////
const GameBoard = (() => {
  let board = ['', '', '', '', '', '', '', '', ''];

  const getBoard = () => board;

  const updateBoard = (index, currPlayer) => board[index] = currPlayer.marker;

  const resetBoard = () => board = ['', '', '', '', '', '', '', '', ''];

  return {getBoard, updateBoard, resetBoard}

})();

const DisplayController = (() => {
  const winnerModal = document.querySelector('.win-modal');
  const modalBg = document.querySelector('.dark-bg');
  const winText = document.querySelector('.winner-text');
  const playerNameModal = document.querySelector('.name-modal');

  const placeMarker = (spot, currentPlayer) => spot.textContent = currentPlayer.marker;

  const showModal = () => {
    winnerModal.classList.add('show');
    modalBg.classList.add('show');
  };

  const displayTieGame = () => {
    showModal();
    winText.textContent = 'TIE GAME!'
  };

  const displayWinner = (winningPlayer) => {
    showModal();
    winText.textContent = `${winningPlayer.name} has won!`.toUpperCase();
  };

  const resetDisplay = (spotButtons) => {
    spotButtons.forEach(button => {
      button.textContent = '';
    });
  };

  const removeModal = () => {
    winnerModal.classList.remove('show');
    modalBg.classList.remove('show');
    playerNameModal.remove('show');
    winText.textContent = '';
  };

  const displayNameModal = () => {
    playerNameModal.classList.add('show');
    modalBg.classList.add('show');
  };

  return {displayTieGame, displayWinner, placeMarker, resetDisplay, removeModal, displayNameModal};

})();




/////////////////// FACTORY FUNCTIONS ///////////////////

const Player = (name) => {
  let marker = '';
  name === 'player1' ? marker = 'X' : marker = 'O';

  return {name, marker}
};



const GameFlow = (() => {
  // gets game board at start (empty board)
  let board = GameBoard.getBoard();
  let players = [Player('player1'), Player('player2')];
  const winCombos = [[0,1,2], [0,3,6], [0,4,8], [1,4,7], [2,4,6], [2,5,8], [3,4,5], [6,7,8]];

  // sets active player to player 1
  let activePlayer = players[0];

  const switchPlayer = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  const tieGame = (roundCount) => roundCount === 9 ? true : false;

  const resetGame = () => board = GameBoard.resetBoard();

  const anyWinners = () => {
    let winners = false;
    let count = 0;
    let firstMarker = '';

    // win combo loop
    for (let i = 0; i < winCombos.length; i++)
    {
      count = 0;
      firstMarker = board[winCombos[i][0]];
      // checks that first index in win combo array is empty if so skip combo
      if (firstMarker === '')
      {
        continue;
      }
      // each winnable combo loop
      for (let j = 0; j < winCombos[i].length; j++)
      {
        // checks that each winnable index that is in win combo has the same marker for all 3 numbers
        if (board[winCombos[i][j]] === firstMarker) {
          count++;
        }
        else {
          break;
        }
      }
      // if count is 3 then there is a winner
      if (count === 3) {
        winners = true;
        break;
      }
    }
    return winners;
  };


  return {switchPlayer, tieGame, anyWinners, getActivePlayer, resetGame}

})();


const GamePlay = () => {
  const spotButtons = document.querySelectorAll('.box');
  const playAgainBtn = document.querySelectorAll('.play-again-btn');
  const cancelBtn = document.querySelector('.cancel-btn');

  const display = DisplayController;
  const board = GameBoard;
  const flow = GameFlow;
  let roundCount = 0;
  let currentPlayer = '';

  spotButtons.forEach((spot) => {
    spot.addEventListener('click', () => {
      currentPlayer = flow.getActivePlayer();
      if (spot.textContent === '') {
        
        board.updateBoard(spot.dataset.index, currentPlayer);
        display.placeMarker(spot, currentPlayer);
        roundCount++;

        if (flow.tieGame(roundCount) === true) 
        {
          display.displayTieGame();
        }

        if (flow.anyWinners() === true)
        {
          display.displayWinner(currentPlayer);
          
        }

        flow.switchPlayer();
      }
    });
  });

  playAgainBtn.forEach(button => {
    button.addEventListener('click', () => {
      flow.resetGame();
      display.resetDisplay(spotButtons);
      display.removeModal();
      roundCount = 0;
      // removes disable attribute from buttons when game is restarted
      spotButtons.forEach(button => {
        button.removeAttribute('disabled', '');
      });
    });
  });

  cancelBtn.addEventListener('click', () => {
    display.removeModal();
    // makes spots disabled so user can not click on spots after game is over
    spotButtons.forEach(button => {
      button.setAttribute('disabled', '');
    });
  });

};

//makes user have to click start game before playing
const startBtn = document.querySelector('.start-btn');
startBtn.addEventListener('click', () => {
  GamePlay();
});



/// have to let players add name, pick marker, fix display stuff to make look better.