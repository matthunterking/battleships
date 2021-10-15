const gameBoard = {
  0: [{ value: 'sea', visable: false }, { value: 'sea', visable: false }, { value: 'sea', visable: false }, { value: 'sea', visable: false }, { value: 'sea', visable: false }, { value: 'sea', visable: false }, { value: 'sea', visable: false }, { value: 'sea', visable: false }, { value: 'sea', visable: false }, { value: 'sea', visable: false }],
  1: [{ value: 'sea', visable: false }, { value: 'sea', visable: false }, { value: 'sea', visable: false }, { value: 'sea', visable: false }, { value: 'sea', visable: false }, { value: 'sea', visable: false }, { value: 'sea', visable: false }, { value: 'sea', visable: false }, { value: 'sea', visable: false }, { value: 'sea', visable: false }],
  2: [{ value: 'sea', visable: false }, { value: 'sea', visable: false }, { value: 'sea', visable: false }, { value: 'sea', visable: false }, { value: 'sea', visable: false }, { value: 'sea', visable: false }, { value: 'sea', visable: false }, { value: 'sea', visable: false }, { value: 'sea', visable: false }, { value: 'sea', visable: false }],
  3: [{ value: 'sea', visable: false }, { value: 'sea', visable: false }, { value: 'sea', visable: false }, { value: 'sea', visable: false }, { value: 'sea', visable: false }, { value: 'sea', visable: false }, { value: 'sea', visable: false }, { value: 'sea', visable: false }, { value: 'sea', visable: false }, { value: 'sea', visable: false }],
  4: [{ value: 'sea', visable: false }, { value: 'sea', visable: false }, { value: 'sea', visable: false }, { value: 'sea', visable: false }, { value: 'sea', visable: false }, { value: 'sea', visable: false }, { value: 'sea', visable: false }, { value: 'sea', visable: false }, { value: 'sea', visable: false }, { value: 'sea', visable: false }],
  5: [{ value: 'sea', visable: false }, { value: 'sea', visable: false }, { value: 'sea', visable: false }, { value: 'sea', visable: false }, { value: 'sea', visable: false }, { value: 'sea', visable: false }, { value: 'sea', visable: false }, { value: 'sea', visable: false }, { value: 'sea', visable: false }, { value: 'sea', visable: false }],
  6: [{ value: 'sea', visable: false }, { value: 'sea', visable: false }, { value: 'sea', visable: false }, { value: 'sea', visable: false }, { value: 'sea', visable: false }, { value: 'sea', visable: false }, { value: 'sea', visable: false }, { value: 'sea', visable: false }, { value: 'sea', visable: false }, { value: 'sea', visable: false }],
  7: [{ value: 'sea', visable: false }, { value: 'sea', visable: false }, { value: 'sea', visable: false }, { value: 'sea', visable: false }, { value: 'sea', visable: false }, { value: 'sea', visable: false }, { value: 'sea', visable: false }, { value: 'sea', visable: false }, { value: 'sea', visable: false }, { value: 'sea', visable: false }],
  8: [{ value: 'sea', visable: false }, { value: 'sea', visable: false }, { value: 'sea', visable: false }, { value: 'sea', visable: false }, { value: 'sea', visable: false }, { value: 'sea', visable: false }, { value: 'sea', visable: false }, { value: 'sea', visable: false }, { value: 'sea', visable: false }, { value: 'sea', visable: false }],
  9: [{ value: 'sea', visable: false }, { value: 'sea', visable: false }, { value: 'sea', visable: false }, { value: 'sea', visable: false }, { value: 'sea', visable: false }, { value: 'sea', visable: false }, { value: 'sea', visable: false }, { value: 'sea', visable: false }, { value: 'sea', visable: false }, { value: 'sea', visable: false }]
};

const squareOptions = ['sea', 'right', 'left', 'up', 'down', 'middle', 'circle', 'flag'];




const $grid = document.querySelector('.grid');

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
    // console.log(cooridinates);
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
    console.log('has an overlap');
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
      // console.log('part', part, verticalPosition, horizontalPosition);

      gameBoard[verticalPosition] = gameBoard[verticalPosition].map((square, index) => {
        if (index === horizontalPosition) {
          const partName = part === 'middle1' || part === 'middle2' ? 'middle' : part;
          const visable = shipInfo.visablePart === part;
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

  console.log(gameBoard);
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

  document.querySelector('button').addEventListener('click', checkAnswer);

};

const checkAnswer = () => {
  console.log(gameBoard)
  const win = Object.values(gameBoard).every((row) => {
    return row.every(square => {
      const noPlayerAnswerButSeaSquare = square.value === 'sea' && !square.playerMove;
      const correct = square.value === square.playerMove;
      return noPlayerAnswerButSeaSquare || correct;
    });
  });

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
    document.querySelector('.winnerMessage').classList.remove('hidden');
  } else {
    console.log('nope!')
  }
};

const setUpShipKey = () => {
  // TO DO ADD SHIPS TO KEY
  // ON CLICK SHOW A CROSS THROUGH THEM
}

generateShipLocations();

setUpGrid();

