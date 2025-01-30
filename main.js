const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let player = {
    x: 50,
    y: 50,
    width: 30,
    height: 30,
    speed: 5,
    moving: false,
    direction: null
};

let maze = [
    [1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1]
];

function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

function update() {
    updateMaze();
    if (player.moving) {
        player.update();
        checkCollision();
    }
}

function updateMaze() {
    // Логика обновления лабиринта
    // Например, перемещение фона или других элементов
    // Здесь можно добавить любую логику, которая должна выполняться постоянно
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMaze();
    drawPlayer();
}

function drawMaze() {
    const cellSize = 50;
    for (let row = 0; row < maze.length; row++) {
        for (let col = 0; col < maze[row].length; col++) {
            if (maze[row][col] === 1) {
                ctx.fillStyle = 'black';
                ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
            }
        }
    }
}

function drawPlayer() {
    ctx.fillStyle = 'blue';
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function moveRight() {
    player.direction = 'right';
    player.moving = true;
}

function moveLeft() {
    player.direction = 'left';
    player.moving = true;
}

function moveUp() {
    player.direction = 'up';
    player.moving = true;
}

function moveDown() {
    player.direction = 'down';
    player.moving = true;
}

function stopMoving() {
    player.moving = false;
    player.direction = null;
}

player.update = function() {
    if (this.direction === 'right') {
        this.x += this.speed;
    } else if (this.direction === 'left') {
        this.x -= this.speed;
    } else if (this.direction === 'up') {
        this.y -= this.speed;
    } else if (this.direction === 'down') {
        this.y += this.speed;
    }
};

function checkCollision() {
    const cellSize = 50;
    const playerRow = Math.floor(player.y / cellSize);
    const playerCol = Math.floor(player.x / cellSize);

    if (maze[playerRow] && maze[playerRow][playerCol] === 1) {
        stopMoving();
    }
}

gameLoop();