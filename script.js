const canvas = document.getElementById('mazeCanvas'); // Обновлено имя canvas
const ctx = canvas.getContext('2d');
let lastTime = performance.now();
let xDown = null;
let yDown = null;
let walls = []; // Массив стен
let stepsCount = 0;
let startTime = Date.now();
let player = {
    x: 50,
    y: 50,
    width: 50,
    height: 50,
    speed: 5
};

// Игрок
player = {
    x: 50,
    y: 50,
    width: 50,
    height: 50,
    speed: 5
};

// Обработка свайпов
function handleTouchStart(evt) {
    const firstTouch = evt.touches[0];
    xDown = firstTouch.clientX;
    yDown = firstTouch.clientY;
}

function handleTouchMove(evt) {
    if (!xDown || !yDown) {
        return;
    }
    const xUp = evt.touches[0].clientX;
    const yUp = evt.touches[0].clientY;
    const xDiff = xDown - xUp;
    const yDiff = yDown - yUp;
    if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (xDiff > 0) {
            // left swipe
            movePlayer('left');
        } else {
            // right swipe
            movePlayer('right');
        }
    } else {
        if (yDiff > 0) {
            // up swipe
            movePlayer('up');
        } else {
            // down swipe
            movePlayer('down');
        }
    }
    // reset values
    xDown = null;
    yDown = null;
}

function movePlayer(direction) {
    let newX = player.x;
    let newY = player.y;

    switch (direction) {
        case 'left':
            newX -= player.speed;
            break;
        case 'right':
            newX += player.speed;
            break;
        case 'up':
            newY -= player.speed;
            break;
        case 'down':
            newY += player.speed;
            break;
    }

    if (!isCollision(newX, newY)) {
        player.x = newX;
        player.y = newY;
        stepsCount++;
        updateStepsDisplay();
        saveGameState();
    }
}

function isCollision(newX, newY) {
    return walls.some(wall => 
        newX < wall.x + wall.width &&
        newX + player.width > wall.x &&
        newY < wall.y + wall.height &&
        newY + player.height > wall.y
    );
}

// Обновление состояния игры
function updateGame(deltaTime) {
    // Здесь можно добавить дополнительную логику обновления
}

// Рендеринг игры
function renderGame() {
    // Очистка холста
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Рендеринг стен
    walls.forEach(wall => {
        if (isWallVisible(wall)) {
            ctx.fillStyle = 'white';
            ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
        }
    });
    // Рендеринг игрока
    ctx.fillStyle = 'blue';
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Основной игровой цикл
function gameLoop(timestamp) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    updateGame(deltaTime);
    renderGame();
    requestAnimationFrame(gameLoop);
}

// Добавляем обработчики событий для свайпов
document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchmove', handleTouchMove, false);

// Обработка клавиш
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

// Функция для сохранения состояния игры
function saveGameState() {
    const gameState = {
        playerPosition: { x: player.x, y: player.y },
        stepsCount: stepsCount,
        startTime: startTime,
    };
    localStorage.setItem('labyrinthState', JSON.stringify(gameState));
}

// Функция для загрузки состояния игры
function loadGameState() {
    const gameState = JSON.parse(localStorage.getItem('labyrinthState'));
    if (gameState) {
        player.x = gameState.playerPosition.x;
        player.y = gameState.playerPosition.y;
        stepsCount = gameState.stepsCount;
        startTime = gameState.startTime;
        updateStepsDisplay();
        updateTimerDisplay();
    }
}

// Функция для обновления отображения шагов
function updateStepsDisplay() {
    document.getElementById('steps').textContent = `Steps: ${stepsCount}`;
}

// Функция для обновления отображения времени
function updateTimerDisplay() {
    const currentTime = Date.now();
    const elapsedTime = Math.floor((currentTime - startTime) / 1000);
    const minutes = Math.floor(elapsedTime / 60).toString().padStart(2, '0');
    const seconds = (elapsedTime % 60).toString().padStart(2, '0');
    document.getElementById('timer').textContent = `Time: ${minutes}:${seconds}`;
}

setInterval(updateTimerDisplay, 1000);

// Функция для проверки видимости стены
function isWallVisible(wallPosition) {
    const dx = wallPosition.x - player.x;
    const dy = wallPosition.y - player.y;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (absDx === 0 || absDy === 0) {
        for (let i = 1; i < Math.max(absDx, absDy); i++) {
            const x = player.position.x + Math.sign(dx) * i;
            const y = player.position.y + Math.sign(dy) * i;
            if (walls.some(w => w.x <= x && w.x + w.width >= x && w.y <= y && w.y + w.height >= y)) {
                return false;
            }
        }
        return true;
    }
    return false;
}

// Инициализация игры
function init() {
    walls = [
        // Пример стен
        { x: 100, y: 100, width: 50, height: 50 },
        { x: 200, y: 200, width: 50, height: 50 },
        // Добавьте остальные стены
    ];
    loadGameState();
    renderGame();
}

// Начало игрового цикла
window.onload = function() {
    init();
    requestAnimationFrame(gameLoop);
};