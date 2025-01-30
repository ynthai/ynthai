const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let lastTime = performance.now();
let xDown = null;
let yDown = null;

// Игрок
let player = {
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
    switch (direction) {
        case 'left':
            player.x -= player.speed;
            break;
        case 'right':
            player.x += player.speed;
            break;
        case 'up':
            player.y -= player.speed;
            break;
        case 'down':
            player.y += player.speed;
            break;
    }
}

// Обновление состояния игры
function updateGame(deltaTime) {
    // Здесь можно добавить дополнительную логику обновления
}

// Рендеринг игры
function renderGame() {
    // Очистка холста
    ctx.clearRect(0, 0, canvas.width, canvas.height);

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

// Начало игрового цикла
requestAnimationFrame(gameLoop);