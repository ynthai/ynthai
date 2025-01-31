const gameContainer = document.getElementById('game-container');
const gridSize = 10; // Размер сетки 10x10
let playerPosition = { x: 0, y: 0 }; // Начальная позиция игрока
let steps = 0; // Количество шагов
let startTime = null; // Время начала игры
let intervalId = null; // ID интервала для обновления времени

// Создание игрового поля
function createGrid() {
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.x = x;
            cell.dataset.y = y;
            if (isWall(x, y)) {
                cell.classList.add('wall');
            } else {
                cell.classList.add('path');
            }
            gameContainer.appendChild(cell);
        }
    }
}

// Проверка, является ли клетка стеной
function isWall(x, y) {
    // Простая логика для примера
    return (x + y) % 2 === 0;
}

// Отрисовка игрока
function drawPlayer() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.classList.remove('player');
        cell.classList.remove('visible-wall');
    });
    const playerIndex = playerPosition.y * gridSize + playerPosition.x;
    cells[playerIndex].classList.add('player');
    updateVisibleWalls();
}

// Обработка нажатий клавиш
function handleKeyPress(event) {
    const prevX = playerPosition.x;
    const prevY = playerPosition.y;

    switch (event.key) {
        case 'ArrowUp':
            if (playerPosition.y > 0 && !isWall(playerPosition.x, playerPosition.y - 1)) {
                playerPosition.y--;
            }
            break;
        case 'ArrowDown':
            if (playerPosition.y < gridSize - 1 && !isWall(playerPosition.x, playerPosition.y + 1)) {
                playerPosition.y++;
            }
            break;
        case 'ArrowLeft':
            if (playerPosition.x > 0 && !isWall(playerPosition.x - 1, playerPosition.y)) {
                playerPosition.x--;
            }
            break;
        case 'ArrowRight':
            if (playerPosition.x < gridSize - 1 && !isWall(playerPosition.x + 1, playerPosition.y)) {
                playerPosition.x++;
            }
            break;
    }

    if (prevX !== playerPosition.x || prevY !== playerPosition.y) {
        steps++;
        updateStepsDisplay();
        saveGameState();
    }

    drawPlayer();
}

// Обновление отображения шагов
function updateStepsDisplay() {
    const stepsDisplay = document.getElementById('steps-display');
    stepsDisplay.textContent = `Steps: ${steps}`;
}

// Обновление отображения времени
function updateTimerDisplay() {
    const currentTime = Date.now();
    const elapsedTime = Math.floor((currentTime - startTime) / 1000);
    const timerDisplay = document.getElementById('timer-display');
    timerDisplay.textContent = `Time: ${elapsedTime}s`;
}

// Сохранение состояния игры
function saveGameState() {
    localStorage.setItem('gameState', JSON.stringify({
        playerPosition,
        steps,
        startTime
    }));
}

// Загрузка состояния игры
function loadGameState() {
    const savedState = localStorage.getItem('gameState');
    if (savedState) {
        const state = JSON.parse(savedState);
        playerPosition = state.playerPosition;
        steps = state.steps;
        startTime = state.startTime;
        intervalId = setInterval(updateTimerDisplay, 1000);
    } else {
        startTime = Date.now();
        intervalId = setInterval(updateTimerDisplay, 1000);
    }
}

// Обновление видимости стен
function updateVisibleWalls() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        const x = parseInt(cell.dataset.x, 10);
        const y = parseInt(cell.dataset.y, 10);
        if (isVisible(x, y)) {
            cell.classList.add('visible-wall');
        } else {
            cell.classList.remove('visible-wall');
        }
    });
}

// Проверка видимости стены
function isVisible(x, y) {
    // Простая логика для примера
    // Можно использовать алгоритмы видимости, такие как Алгоритм Переносного Видимого Области (PVS)
    const dx = x - playerPosition.x;
    const dy = y - playerPosition.y;
    const distance = Math.abs(dx) + Math.abs(dy);

    if (distance > 5) return false; // Ограничение видимости на 5 клеток

    for (let i = 1; i <= distance; i++) {
        const cx = playerPosition.x + Math.sign(dx) * i;
        const cy = playerPosition.y + Math.sign(dy) * i;
        if (isWall(cx, cy) && (cx !== x || cy !== y)) {
            return false;
        }
    }

    return true;
}

// Инициализация игры
function initGame() {
    createGrid();
    loadGameState();
    drawPlayer();
    window.addEventListener('keydown', handleKeyPress);
}

initGame();