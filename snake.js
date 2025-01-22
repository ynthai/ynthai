const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gridSize = 20;
const tileCount = 20;

canvas.width = Math.min(window.innerWidth, window.innerHeight) - 40;
canvas.height = canvas.width;

const tileSize = canvas.width / tileCount;

let snake = [{ x: 10, y: 10 }];
let direction = { x: 0, y: 0 };
let food = { x: 5, y: 5 };
let score = 0;

function gameLoop() {
    update();
    draw();
    setTimeout(gameLoop, 100);
}

function update() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        resetGame();
        return;
    }

    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        resetGame();
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        placeFood();
    } else {
        snake.pop();
    }
}

function draw() {
    // Очищаем canvas черным цветом
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Рисуем змейку белым цветом
    ctx.fillStyle = "white";
    snake.forEach(segment => ctx.fillRect(segment.x * tileSize, segment.y * tileSize, tileSize, tileSize));

    // Рисуем еду серым цветом
    ctx.fillStyle = "gray";
    ctx.fillRect(food.x * tileSize, food.y * tileSize, tileSize, tileSize);

    // Отображаем счет белым цветом
    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.fillText("Счет: " + score, 10, 20);
}

function placeFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);

    if (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
        placeFood();
    }
}

function resetGame() {
    snake = [{ x: 10, y: 10 }];
    direction = { x: 0, y: 0 };
    score = 0;
    placeFood();
}

// Обработчики для кнопок управления
document.getElementById("up").addEventListener("touchstart", () => {
    if (direction.y === 0) direction = { x: 0, y: -1 };
});

document.getElementById("down").addEventListener("touchstart", () => {
    if (direction.y === 0) direction = { x: 0, y: 1 };
});

document.getElementById("left").addEventListener("touchstart", () => {
    if (direction.x === 0) direction = { x: -1, y: 0 };
});

document.getElementById("right").addEventListener("touchstart", () => {
    if (direction.x === 0) direction = { x: 1, y: 0 };
});

// Клавиатурное управление
document.addEventListener("keydown", event => {
    switch (event.key) {
        case "ArrowUp":
            if (direction.y === 0) direction = { x: 0, y: -1 };
            break;
        case "ArrowDown":
            if (direction.y === 0) direction = { x: 0, y: 1 };
            break;
        case "ArrowLeft":
            if (direction.x === 0) direction = { x: -1, y: 0 };
            break;
        case "ArrowRight":
            if (direction.x === 0) direction = { x: 1, y: 0 };
            break;
    }
});

placeFood();
gameLoop();