let gameBoard;
const ships = [
  ['end', 'middle1', 'middle2', 'end'],
  ['end', 'middle', 'end'],
  ['end', 'middle', 'end'],
  ['end', 'end'],
  ['end', 'end'],
  ['end', 'end'],
  ['circle'],
  ['circle'],
  ['circle'],
  ['circle']
];
const squareOptions = ['sea', 'right', 'left', 'up', 'down', 'middle', 'circle', 'flag', 'blank'];

const $grid = document.querySelector('.grid');
const $shipLegend = document.querySelector('.shipLegend');
const $checkAnswerButton = document.querySelector('.checkAnswer');
const $playAgainButton = document.querySelector('.playAgain');
const $continueButton = document.querySelector('.continue');
const $showAnswerButton = document.querySelector('.showAnswer');
const $endGameMessage = document.querySelector('.endGameMessage');
const $innerWinnerMessage = document.querySelector('.innerWinnerMessage');
const $innerLoserMessage = document.querySelector('.innerLoserMessage');

const generateGameBoard = () => {
  return new Array(10).fill('').reduce((gameBoard, value, index) => {
    gameBoard[index] = new Array(10).fill({ value: 'sea', visable: false });
    return gameBoard;
  }, {});
};

const generateShipsToBePlaced = () => {
  let isVertical = false;
  return ships.map(shipMakeUp => {
    if (shipMakeUp.length > 1) {
      isVertical = Math.random() > 0.5 && shipMakeUp.length > 1;
      shipMakeUp = shipMakeUp.map((shipPart, index) => {
        if (shipPart === 'end') {
          if (index === 0) {
            return isVertical ? 'up' : 'left';
          } else {
            return isVertical ? 'down' : 'right';
          }
        }
        return shipPart;
      });
    }
    let visablePart = null;
    if (Math.random() > 0.3) {
      visablePart = shipMakeUp[Math.floor(Math.random() * shipMakeUp.length)];
    }
    return { isVertical, ship: shipMakeUp, visablePart };
  });
};

const getStartPointRange = ({ isVertical, ship }) => {
  const maxPosition = 9 - (ship.length - 1);
  const horizonalMax = isVertical ? 9 : maxPosition;
  const verticalMax = isVertical ? maxPosition : 9;
  return { horizonalMax, verticalMax };
};

const generateRandomPoint = (maximum) => {
  return Math.floor(Math.random() * (maximum - 0 + 1) + 0);
};

const getSquareFootprint = (horizonalCoordinate, verticalCoordinate) => {
  const coordinates = [-1, 0, 1].map(horizonalValue => {
    return [
      [horizonalCoordinate + horizonalValue, verticalCoordinate - 1],
      [horizonalCoordinate + horizonalValue, verticalCoordinate],
      [horizonalCoordinate + horizonalValue, verticalCoordinate + 1]
    ];
  });
  return coordinates.flat();
};

const checkForOverlap = (footprint) => {
  return footprint.some(cooridinates => {
    if (
      cooridinates[0] < 0 || cooridinates[1] < 0 ||
      cooridinates[0] > 9 || cooridinates[1] > 9
    ) return false;
    return gameBoard[cooridinates[1]][cooridinates[0]].value !== 'sea';
  });
};

const generateShipPosition = (shipInfo) => {
  const range = getStartPointRange(shipInfo);

  const startPointHorizontal = generateRandomPoint(range.horizonalMax);
  const startPointVertical = generateRandomPoint(range.verticalMax);

  const shipFootprint = shipInfo.ship.map((part, index) => {
    const verticalPosition = shipInfo.isVertical ? startPointVertical + index : startPointVertical;
    const horizontalPosition = shipInfo.isVertical ? startPointHorizontal : startPointHorizontal + index;
    return getSquareFootprint(horizontalPosition, verticalPosition);
  }).flat();

  const hasOverLap = checkForOverlap(shipFootprint);

  if (hasOverLap) {
    return generateShipPosition(shipInfo);
  } else {
    return { startPointHorizontal, startPointVertical };
  }

};

const generateShipLocations = () => {
  const shipsToBePlaced = generateShipsToBePlaced();
  shipsToBePlaced.forEach(shipInfo => {
    const { startPointVertical, startPointHorizontal } = generateShipPosition(shipInfo);

    shipInfo.ship.forEach((part, index) => {
      const verticalPosition = shipInfo.isVertical ? startPointVertical + index : startPointVertical;
      const horizontalPosition = shipInfo.isVertical ? startPointHorizontal : startPointHorizontal + index;

      gameBoard[verticalPosition] = gameBoard[verticalPosition].map((square, index) => {
        if (index === horizontalPosition) {
          const partName = part === 'middle1' || part === 'middle2' ? 'middle' : part;
          const visable = shipInfo.visablePart === part;
          // const visable = true;
          return { value: partName, visable, playerMove: visable ? partName : null };
        } else {
          return square;
        }
      });
    });

  });

};

const clickSquare = ($target, rowNumber, columnNumber) => {
  const previousSquareValue = gameBoard[rowNumber][columnNumber].playerMove;
  const nextOptionIndex = previousSquareValue ? squareOptions.indexOf(previousSquareValue) + 1 : 0;
  const newSquareValue = nextOptionIndex === squareOptions.length ? squareOptions[0] : squareOptions[nextOptionIndex];

  gameBoard[rowNumber] = gameBoard[rowNumber].map((square, index) => {
    if (index === columnNumber) {
      return { ...square, playerMove: newSquareValue };
    }
    return square;
  });

  $target.classList.remove(previousSquareValue);
  $target.classList.add(newSquareValue);

};

const setUpGrid = () => {
  Object.values(gameBoard).forEach((row, rowNumber) => {
    row.forEach((square, columnNumber) => {
      const $square = document.createElement('div');
      $square.setAttribute('id', `${rowNumber}, ${columnNumber}`);
      $square.classList.add('square');
      if (square.visable) {
        $square.classList.add(square.value);
      } else {
        $square.addEventListener('click', ({ target }) => clickSquare(target, rowNumber, columnNumber));
      }
      $grid.append($square);
    });

    const rowTotal = row.reduce((total, square) => {
      if (square.value !== 'sea') total++;
      return total;
    }, 0);

    const $rowTotal = document.createElement('div');
    $rowTotal.classList.add('square');
    $rowTotal.classList.add('total');
    $rowTotal.innerText = rowTotal;
    $grid.append($rowTotal);
  });

  const bottomRow = new Array(10).fill('').map((x, index) => {
    return Object.values(gameBoard).reduce((total, arrayOfValues) => {
      if (arrayOfValues[index].value !== 'sea') {
        total++;
      }
      return total;
    }, 0);
  });

  bottomRow.forEach(square => {
    const $square = document.createElement('div');
    $square.classList.add('square');
    $square.classList.add('total');
    $square.innerText = square;
    $grid.append($square);
  });

  $checkAnswerButton.innerText = 'CHECK ANSWER';
  $checkAnswerButton.removeEventListener('click', setUpGame);
  $checkAnswerButton.addEventListener('click', checkAnswer);
  $playAgainButton.addEventListener('click', setUpGame);
  $continueButton.addEventListener('click', closeMessage);
  $showAnswerButton.addEventListener('click', showAnswer);
};

const closeMessage = () => {
  $endGameMessage.classList.add('hidden');
};

const showAnswer = () => {
  const wrongAnswers = Object.values(gameBoard).reduce((wrongAnswers, row, rowIndex) => {
    const wrongRowAnswers = row.reduce((rowWrong, square, columnIndex) => {
      if ((square.value !== 'sea' && square.playerMove !== square.value) ||
        (square.value === 'sea' && square.playerMove && square.playerMove !== square.value)
      ) {
        rowWrong = [...rowWrong, [rowIndex, columnIndex]];
      }
      return rowWrong;
    }, []);
    wrongAnswers = [...wrongAnswers, ...wrongRowAnswers];
    return wrongAnswers;
  }, []);

  wrongAnswers.forEach(coordinates => {
    const $squareToAmend = document.getElementById(`${coordinates[0]}, ${coordinates[1]}`);
    const { value, playerMove } = gameBoard[coordinates[0]][coordinates[1]];
    $squareToAmend.classList.remove(playerMove);
    $squareToAmend.classList.add('highlight', value);
  });

  closeMessage();
  $checkAnswerButton.innerText = 'NEW GAME';
  $checkAnswerButton.addEventListener('click', setUpGame);
};

const checkAnswer = () => {
  const win = Object.values(gameBoard).every((row) => {
    return row.every(square => {
      const noPlayerAnswerButSeaSquare = square.value === 'sea' && !square.playerMove;
      const correct = square.value === square.playerMove;
      return noPlayerAnswerButSeaSquare || correct;
    });
  });

  $endGameMessage.classList.remove('hidden');

  if (win) {
    Object.keys(gameBoard).forEach(rowNumber => {
      gameBoard[rowNumber] = gameBoard[rowNumber].map((square, columnNumber) => {
        if (!square.playerMove) {
          document.getElementById(`${rowNumber}, ${columnNumber}`).classList.add('sea');
          return { ...square, playerMove: 'sea' };
        }
        return square;
      });
    });
    $innerWinnerMessage.classList.remove('hidden');
  } else {
    $innerLoserMessage.classList.remove('hidden');
  }
};

const setUpShipKey = () => {
  ships.forEach(shipParts => {
    const $shipContainer = document.createElement('div');
    const $ship = document.createElement('div');
    const $cross = document.createElement('div');
    $ship.classList.add('ship');
    $shipContainer.classList.add('shipContainer');
    $cross.classList.add('cross', 'noCross');

    $cross.addEventListener('click', ({ target }) => {
      if (target.classList.contains('noCross')) {
        target.classList.remove('noCross');
      } else {
        target.classList.add('noCross');
      }
    });

    shipParts.forEach((partName, index) => {
      const $square = document.createElement('div');
      $square.classList.add('square');
      let className = partName;
      if (partName === 'end') {
        className = index === 0 ? 'left' : 'right';
      }
      if (partName === 'middle1' || partName === 'middle2') {
        className = 'middle';
      }
      $square.classList.add(className);
      $ship.append($square);
    });

    $ship.setAttribute('style', `
    grid-template-columns: repeat(${shipParts.length}, 1fr);
    width: ${(shipParts.length / 4) * 100}%;
    `);

    $shipContainer.append($ship);
    $shipContainer.append($cross);
    $shipLegend.append($shipContainer);
  });
};

const setUpGame = () => {
  $grid.innerText = '';
  $endGameMessage.classList.add('hidden');
  $endGameMessage.classList.add('hidden');
  gameBoard = generateGameBoard();
  generateShipLocations();
  setUpGrid();
};

setUpShipKey();
setUpGame();

