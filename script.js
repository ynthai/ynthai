const levels = [
    [
        ['wall', 'wall', 'wall', 'wall', 'wall'],
        ['wall', 'start', 'empty', 'empty', 'wall'],
        ['wall', 'wall', 'wall', 'empty', 'wall'],
        ['wall', 'empty', 'empty', 'empty', 'wall'],
        ['wall', 'wall', 'wall', 'finish', 'wall']
    ],
    // Добавьте другие уровни здесь
];

let currentLevelIndex = 0;
let currentLevel = levels[currentLevelIndex];
let playerPosition = { x: 0, y: 0 };

function initLevel(level) {
    const container = document.querySelector('.container');
    container.innerHTML = '';

    for (let i = 0; i < level.length; i++) {
        const row = document.createElement('div');
        row.className = 'row';
        for (let j = 0; j < level[i].length; j++) {
            const cell = document.createElement('div');
            cell.className = `cell ${level[i][j]}`;
            if (level[i][j] === 'start') {
                playerPosition = { x: j, y: i };
            }
            row.appendChild(cell);
        }
        container.appendChild(row);
    }
}

function movePlayer(direction) {
    let newX = playerPosition.x;
    let newY = playerPosition.y;

    switch (direction) {
        case 'up':
            newY--;
            break;
        case 'down':
            newY++;
            break;
        case 'left':
            newX--;
            break;
        case 'right':
            newX++;
            break;
    }

    // Проверка выхода за границы уровня
    if (newY < 0 || newY >= currentLevel.length || newX < 0 || newX >= currentLevel[0].length) {
        return;
    }

    // Проверка столкновения с препятствием
    if (currentLevel[newY][newX] === 'wall') {
        return;
    }

    // Обновление позиции игрока
    const oldCell = document.querySelector(`.row:nth-child(${playerPosition.y + 1}) .cell:nth-child(${playerPosition.x + 1})`);
    oldCell.classList.remove('player');

    playerPosition.x = newX;
    playerPosition.y = newY;

    const newCell = document.querySelector(`.row:nth-child(${playerPosition.y + 1}) .cell:nth-child(${playerPosition.x + 1})`);
    newCell.classList.add('player');

    // Проверка достижения финиша
    if (currentLevel[newY][newX] === 'finish') {
        alert('Вы выиграли!');
        loadNextLevel();
    }
}

function loadNextLevel() {
    currentLevelIndex++;
    if (currentLevelIndex < levels.length) {
        currentLevel = levels[currentLevelIndex];
        initLevel(currentLevel);
    } else {
        alert('Поздравляем! Вы прошли все уровни!');
    }
}

document.addEventListener('keydown', function(event) {
    switch (event.key) {
        case 'ArrowUp':
            movePlayer('up');
            break;
        case 'ArrowDown':
            movePlayer('down');
            break;
        case 'ArrowLeft':
            movePlayer('left');
            break;
        case 'ArrowRight':
            movePlayer('right');
            break;
    }
});

// Инициализация первого уровня
initLevel(currentLevel);