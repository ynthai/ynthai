// script.js

// Размер сетки
const rows = 5;
const cols = 6;

// Типы элементов
const types = ['fire', 'water', 'earth', 'light', 'dark'];

// Создание сетки
let grid = [];
let score = 0;

function createGrid() {
  const gridElement = document.getElementById('grid');
  gridElement.innerHTML = '';

  // Заполняем сетку случайными элементами
  for (let r = 0; r < rows; r++) {
    grid[r] = [];
    for (let c = 0; c < cols; c++) {
      const type = types[Math.floor(Math.random() * types.length)];
      grid[r][c] = type;

      // Создаем ячейку
      const cell = document.createElement('div');
      cell.classList.add('cell', type);
      cell.dataset.row = r;
      cell.dataset.col = c;
      cell.addEventListener('click', () => selectCell(r, c));
      gridElement.appendChild(cell);
    }
  }
}

// Выделение ячейки
let selectedCell = null;

function selectCell(row, col) {
  if (selectedCell === null) {
    selectedCell = { row, col };
    highlightCell(row, col);
  } else {
    const newRow = row;
    const newCol = col;

    // Проверяем, что выбранная ячейка рядом
    if (
      Math.abs(newRow - selectedCell.row) + Math.abs(newCol - selectedCell.col) === 1
    ) {
      swapCells(selectedCell.row, selectedCell.col, newRow, newCol);
    }

    deselectCell();
  }
}

// Подсветка ячейки
function highlightCell(row, col) {
  const cell = getCellElement(row, col);
  cell.style.border = '2px solid black';
}

// Убираем выделение
function deselectCell() {
  if (selectedCell) {
    const cell = getCellElement(selectedCell.row, selectedCell.col);
    cell.style.border = '1px solid #ccc';
    selectedCell = null;
  }
}

// Обмен ячеек
function swapCells(r1, c1, r2, c2) {
  // Меняем значения в массиве
  const temp = grid[r1][c1];
  grid[r1][c1] = grid[r2][c2];
  grid[r2][c2] = temp;

  // Обновляем DOM
  updateGrid();

  // Проверяем совпадения
  const matches = findMatches();
  if (matches.length > 0) {
    clearMatches(matches);
    addScore(matches.length);
  } else {
    // Если нет совпадений, отменяем обмен
    swapCells(r1, c1, r2, c2);
  }
}

// Поиск совпадений
function findMatches() {
  const matches = [];

  // Проверяем горизонтальные совпадения
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c <= cols - 3; c++) {
      if (
        grid[r][c] &&
        grid[r][c] === grid[r][c + 1] &&
        grid[r][c] === grid[r][c + 2]
      ) {
        matches.push({ row: r, col: c });
        matches.push({ row: r, col: c + 1 });
        matches.push({ row: r, col: c + 2 });
      }
    }
  }

  // Проверяем вертикальные совпадения
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r <= rows - 3; r++) {
      if (
        grid[r][c] &&
        grid[r][c] === grid[r + 1][c] &&
        grid[r][c] === grid[r + 2][c]
      ) {
        matches.push({ row: r, col: c });
        matches.push({ row: r + 1, col: c });
        matches.push({ row: r + 2, col: c });
      }
    }
  }

  return matches;
}

// Очистка совпадений
function clearMatches(matches) {
  matches.forEach(({ row, col }) => {
    grid[row][col] = null;
    const cell = getCellElement(row, col);
    cell.classList.remove(...types);
  });

  // Добавляем новые элементы сверху
  for (let c = 0; c < cols; c++) {
    let emptySpaces = 0;

    for (let r = rows - 1; r >= 0; r--) {
      if (!grid[r][c]) {
        emptySpaces++;
      } else if (emptySpaces > 0) {
        grid[r + emptySpaces][c] = grid[r][c];
        grid[r][c] = null;
      }
    }

    for (let r = 0; r < emptySpaces; r++) {
      grid[r][c] = types[Math.floor(Math.random() * types.length)];
    }
  }

  updateGrid();
}

// Обновление сетки в DOM
function updateGrid() {
  const gridElement = document.getElementById('grid');
  gridElement.innerHTML = '';

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = document.createElement('div');
      cell.classList.add('cell', grid[r][c] || '');
      cell.dataset.row = r;
      cell.dataset.col = c;
      cell.addEventListener('click', () => selectCell(r, c));
      gridElement.appendChild(cell);
    }
  }
}

// Получение элемента ячейки по координатам
function getCellElement(row, col) {
  return document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
}

// Добавление очков
function addScore(amount) {
  score += amount * 10;
  document.getElementById('score').textContent = score;
}

// Инициализация игры
createGrid();
