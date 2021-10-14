const solution = {
  0: ['sea', 'right', 'left', 'sea', 'sea', 'sea', 'sea', 'sea', 'sea', 'sea'],
  1: ['sea', 'sea', 'sea', 'sea', 'sea', 'sea', 'sea', 'sea', 'sea', 'sea'],
  2: ['sea', 'sea', 'sea', 'sea', 'sea', 'sea', 'sea', 'sea', 'sea', 'sea'],
  3: ['sea', 'sea', 'sea', 'sea', 'sea', 'sea', 'sea', 'sea', 'sea', 'sea'],
  4: ['sea', 'sea', 'sea', 'sea', 'sea', 'sea', 'sea', 'sea', 'sea', 'sea'],
  5: ['sea', 'sea', 'sea', 'sea', 'sea', 'sea', 'sea', 'sea', 'sea', 'sea'],
  6: ['sea', 'sea', 'sea', 'sea', 'sea', 'sea', 'sea', 'sea', 'sea', 'sea'],
  7: ['sea', 'sea', 'sea', 'sea', 'sea', 'sea', 'sea', 'sea', 'sea', 'sea'],
  8: ['sea', 'sea', 'sea', 'sea', 'sea', 'sea', 'sea', 'sea', 'sea', 'sea'],
  9: ['sea', 'sea', 'sea', 'sea', 'sea', 'sea', 'sea', 'sea', 'sea', 'sea']
};

const squareOptions = ['sea', 'right', 'left', 'up', 'down', 'middle', 'circle', 'flag'];

const playerMoves = {
  0: [null, null, null, null, null, null, null, null, null, null],
  1: [null, null, null, null, null, null, null, null, null, null],
  2: [null, null, null, null, null, null, null, null, null, null],
  3: [null, null, null, null, null, null, null, null, null, null],
  4: [null, null, null, null, null, null, null, null, null, null],
  5: [null, null, null, null, null, null, null, null, null, null],
  6: [null, null, null, null, null, null, null, null, null, null],
  7: [null, null, null, null, null, null, null, null, null, null],
  8: [null, null, null, null, null, null, null, null, null, null],
  9: [null, null, null, null, null, null, null, null, null, null]
};

console.log('playerMoves', playerMoves);
console.log('solution', solution);


const $grid = document.querySelector('.grid');

const clickSquare = ($target, rowNumber, columnNumber) => {
  const previousSquareValue = playerMoves[rowNumber][columnNumber];
  const nextOptionIndex = previousSquareValue ? squareOptions.indexOf(previousSquareValue) + 1 : 0;
  const newSquareValue = nextOptionIndex === squareOptions.length ? squareOptions[0] : squareOptions[nextOptionIndex];

  playerMoves[rowNumber] = playerMoves[rowNumber].map((value, index) => {
    if (index === columnNumber) {
      return newSquareValue;
    }
    return value;
  });

  console.log(playerMoves);

  $target.classList.remove(previousSquareValue);
  $target.classList.add(newSquareValue);

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
      if (squareValue !== 'sea') total++;
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
      if (arrayOfValues[index] !== 'sea') {
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
  const win = Object.values(playerMoves).every((row, rowIndex) => {
    return row.reduce((matches, value, columnIndex) => {
      if (value === solution[rowIndex][columnIndex]) {
        matches = true;
      }
      return matches;
    }, false);
  });
  if (win) console.log('winnner!!!!');
};

setUpGrid();

