// Константы
const gridSize = 6;
const colors = [
  'pastel-red',
  'pastel-blue',
  'pastel-green',
  'pastel-yellow',
  'pastel-purple',
  'pastel-orange',
];
let score = 0;

// Создаем игровое поле
let grid = [];
const gameGrid = document.getElementById('grid');
const scoreBoard = document.getElementById('score-board');

function createGrid() {
  for (let i = 0; i < gridSize * gridSize; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = i;
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    cell.classList.add(randomColor);
    grid.push(randomColor);
    gameGrid.appendChild(cell);
  }
}

// Проверка комбинаций
function checkMatches() {
  let matches = [];

  // По горизонтали
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col <= gridSize - 3; col++) {
      const index = row * gridSize + col;
      if (
        grid[index] &&
        grid[index] === grid[index + 1] &&
        grid[index] === grid[index + 2]
      ) {
        matches.push(index, index + 1, index + 2);
      }
    }
  }

  // По вертикали
  for (let col = 0; col < gridSize; col++) {
    for (let row = 0; row <= gridSize - 3; row++) {
      const index = row * gridSize + col;
      if (
        grid[index] &&
        grid[index] === grid[index + gridSize] &&
        grid[index] === grid[index + gridSize * 2]
      ) {
        matches.push(index, index + gridSize, index + gridSize * 2);
      }
    }
  }

  return matches;
}

// Удаление совпадений
function removeMatches(matches) {
  matches.forEach(index => {
    grid[index] = null;
    const cell = document.querySelector(`.cell[data-index="${index}"]`);
    cell.classList.remove(...colors);
    cell.classList.add('remove');
    setTimeout(() => {
      cell.style.backgroundColor = '#e8f0fe';
      cell.classList.remove('remove');
    }, 300);
  });
  score += matches.length * 10; // Начисляем очки
  scoreBoard.textContent = `Score: ${score}`;
}

// Добавление новых элементов
function refillGrid() {
  for (let i = 0; i < gridSize * gridSize; i++) {
    if (!grid[i]) {
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      grid[i] = randomColor;
      const cell = document.querySelector(`.cell[data-index="${i}"]`);
      cell.classList.add(randomColor);
    }
  }
}

// Перемещение элементов
let selectedCell = null;
let selectedColor = null;

function handleCellClick(e) {
  const target = e.target;
  const color = target.className.split(' ')[1];

  if (selectedCell === null) {
    selectedCell = target;
    selectedColor = color;
    target.style.border = '2px solid black';
  } else {
    const targetIndex = parseInt(target.dataset.index);
    const sourceIndex = parseInt(selectedCell.dataset.index);

    // Проверяем соседние ячейки
    const diff = Math.abs(targetIndex - sourceIndex);
    const isAdjacent =
      diff === 1 && Math.floor(targetIndex / gridSize) === Math.floor(sourceIndex / gridSize) || // Горизонтально
      diff === gridSize; // Вертикально

    if (isAdjacent) {
      // Меняем цвета
      grid[sourceIndex] = color;
      grid[targetIndex] = selectedColor;

      selectedCell.classList.remove(selectedColor);
      target.classList.remove(color);

      selectedCell.classList.add(color);
      target.classList.add(selectedColor);

      // Проверяем совпадения
      const matches = checkMatches();
      if (matches.length > 0) {
        removeMatches(matches);
        refillGrid();
      } else {
        // Возвращаем обратно, если нет совпадений
        [grid[sourceIndex], grid[targetIndex]] = [grid[targetIndex], grid[sourceIndex]];
        selectedCell.classList.remove(color);
        target.classList.remove(selectedColor);

        selectedCell.classList.add(selectedColor);
        target.classList.add(grid[targetIndex]);
      }
    }

    selectedCell.style.border = '';
    selectedCell = null;
    selectedColor = null;
  }
}

// Инициализация игры
createGrid();

// Добавляем обработчик кликов
document.querySelectorAll('.cell').forEach(cell => {
  cell.addEventListener('click', handleCellClick);
});

// Тачскрин для iPhone
document.addEventListener('touchstart', e => {
  const target = e.target.closest('.cell');
  if (target) handleCellClick({ target });
});