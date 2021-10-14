const solution = {
  0: [0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
  1: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  2: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  3: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  4: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  5: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  6: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  7: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  8: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  9: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
};


let playerMoves = {
  0: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  1: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  2: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  3: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  4: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  5: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  6: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  7: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  8: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  9: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
};

console.log('playerMoves', playerMoves);
console.log('solution', solution);


const $grid = document.querySelector('.grid');

const clickSquare = ($target, rowNumber, columnNumber) => {

  playerMoves[rowNumber] = playerMoves[rowNumber].map((value, index) => {
    if (index === columnNumber) {
      return value === 0 ? 1 : 0;
    }
    return value;
  });

  if (playerMoves[rowNumber][columnNumber] === 1) {
    $target.classList.remove('ship');
    $target.classList.add('sea');
  } else {
    $target.classList.remove('sea');
    $target.classList.add('ship');
  }

};

const setUpGrid = () => {
  Object.values(solution).forEach((row, rowNumber) => {
    row.forEach((square, columnNumber) => {
      const $square = document.createElement('div');
      $square.classList.add('square');
      $square.addEventListener('click', ({ target }) => clickSquare(target, rowNumber, columnNumber));
      $grid.append($square);
    });

    const rowTotal = row.reduce((total, squareValue) => {
      if (squareValue === 1) total++;
      return total;
    }, 0);

    const $rowTotal = document.createElement('div');
    $rowTotal.classList.add('square');
    $rowTotal.classList.add('total');
    $rowTotal.innerText = rowTotal;
    $grid.append($rowTotal);
  });

  const bottomRow = new Array(10).fill('').map((x, index) => {
    return Object.values(solution).reduce((total, arrayOfValues) => {
      return total + arrayOfValues[index];
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
  const win = Object.values(playerMoves).every((row, rowIndex) => {
    return row.reduce((matches, value, columnIndex) => {
      if (value === solution[rowIndex][columnIndex]) {
        matches = true;
      }
      return matches;
    }, false)
  });
  if (win) console.log('winnner!!!!')
}

setUpGrid();

