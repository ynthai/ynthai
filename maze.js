const CELL_SIZE = 30; // Размер клетки в пикселях
const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");
let maze, player;
let playerPos = { x: 0, y: 0 }; // Позиция игрока для плавного движения
let exitOpen = false; // Состояние двери
let exitAnimationProgress = 0; // Прогресс анимации
const winPopup = document.getElementById("winPopup");
let npcs = []; // Массив для хранения NPC

class Cell {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.walls = [true, true, true, true]; // Верх, право, низ, лево
        this.visited = false;
    }
}

class Maze {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.grid = [];
        this.exitX = width - 1;
        this.exitY = height - 1;
        this.initializeGrid();
    }

    initializeGrid() {
        for (let x = 0; x < this.width; x++) {
            this.grid[x] = [];
            for (let y = 0; y < this.height; y++) {
                this.grid[x][y] = new Cell(x, y);
            }
        }
    }

    generateMaze(startX, startY) {
        const stack = [];
        const startCell = this.grid[startX][startY];
        startCell.visited = true;
        stack.push(startCell);
        while (stack.length > 0) {
            const currentCell = stack.pop();
            const neighbors = this.getUnvisitedNeighbors(currentCell);
            if (neighbors.length > 0) {
                stack.push(currentCell);
                const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
                this.removeWall(currentCell, randomNeighbor);
                randomNeighbor.visited = true;
                stack.push(randomNeighbor);
            }
        }
        // Добавляем дополнительные проходы для создания нескольких маршрутов
        this.addExtraPaths(5); // Добавляем 5 дополнительных проходов
    }

    getUnvisitedNeighbors(cell) {
        const neighbors = [];
        const { x, y } = cell;
        if (y > 0 && !this.grid[x][y - 1].visited) neighbors.push(this.grid[x][y - 1]); // Верх
        if (x < this.width - 1 && !this.grid[x + 1][y].visited) neighbors.push(this.grid[x + 1][y]); // Право
        if (y < this.height - 1 && !this.grid[x][y + 1].visited) neighbors.push(this.grid[x][y + 1]); // Низ
        if (x > 0 && !this.grid[x - 1][y].visited) neighbors.push(this.grid[x - 1][y]); // Лево
        return neighbors;
    }

    removeWall(current, neighbor) {
        const dx = neighbor.x - current.x;
        const dy = neighbor.y - current.y;
        if (dx === 1) { // Сосед справа
            current.walls[1] = false;
            neighbor.walls[3] = false;
        } else if (dx === -1) { // Сосед слева
            current.walls[3] = false;
            neighbor.walls[1] = false;
        } else if (dy === 1) { // Сосед снизу
            current.walls[2] = false;
            neighbor.walls[0] = false;
        } else if (dy === -1) { // Сосед сверху
            current.walls[0] = false;
            neighbor.walls[2] = false;
        }
    }

    addExtraPaths(count) {
        for (let i = 0; i < count; i++) {
            const x = Math.floor(Math.random() * (this.width - 1));
            const y = Math.floor(Math.random() * (this.height - 1));
            // Удаляем случайные стены для создания дополнительных проходов
            if (Math.random() < 0.5) {
                this.removeWall(this.grid[x][y], this.grid[x + 1][y]); // Удаляем стену справа
            } else {
                this.removeWall(this.grid[x][y], this.grid[x][y + 1]); // Удаляем стену снизу
            }
        }
    }

    isExit(x, y) {
        return x === this.exitX && y === this.exitY;
    }
}

class Player {
    constructor(startX, startY) {
        this.x = startX;
        this.y = startY;
    }

    move(dx, dy) {
        const currentCell = maze.grid[this.x][this.y];
        if (dx === 1 && !currentCell.walls[1]) this.x++; // Вправо
        if (dx === -1 && !currentCell.walls[3]) this.x--; // Влево
        if (dy === 1 && !currentCell.walls[2]) this.y++; // Вниз
        if (dy === -1 && !currentCell.walls[0]) this.y--; // Вверх
        // Вибрация при ударе о стену
        if ((dx === 1 && currentCell.walls[1]) ||
            (dx === -1 && currentCell.walls[3]) ||
            (dy === 1 && currentCell.walls[2]) ||
            (dy === -1 && currentCell.walls[0])) {
            if ("vibrate" in navigator) navigator.vibrate(100); // Вибрация 100 мс
        }
        animatePlayer();
        checkWin();
        checkNPCCollision(); // Проверка столкновений после каждого хода
    }
}

function checkWin() {
    if (maze.isExit(player.x, player.y)) {
        exitOpen = true;
        animateExit();
        setTimeout(showWinPopup, 1000); // Показываем попап через 1 секунду
    }
}

function checkNPCCollision() {
    npcs.forEach(npc => {
        if (npc.x === player.x && npc.y === player.y) {
            alert("Вас поймали! Игра окончена.");
            resetGame();
        }
    });
}

function init() {
    const width = 10;
    const height = 10;
    canvas.width = width * CELL_SIZE;
    canvas.height = height * CELL_SIZE;
    maze = new Maze(width, height);
    maze.generateMaze(0, 0);
    player = new Player(0, 0);
    playerPos = { x: player.x * CELL_SIZE, y: player.y * CELL_SIZE };
    spawnNPCs(3); // Создаем 3 NPC
    drawMaze();
    // Обработка нажатий клавиш
    window.addEventListener("keydown", (e) => {
        if (e.key === "ArrowUp" || e.key === "w") player.move(0, -1);
        if (e.key === "ArrowDown" || e.key === "s") player.move(0, 1);
        if (e.key === "ArrowLeft" || e.key === "a") player.move(-1, 0);
        if (e.key === "ArrowRight" || e.key === "d") player.move(1, 0);
    });
    // Инициализация Hammer.js для обработки свайпов
    const hammer = new Hammer(canvas);
    hammer.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
    hammer.on('swipeup', () => player.move(0, -1));
    hammer.on('swipedown', () => player.move(0, 1));
    hammer.on('swipeleft', () => player.move(-1, 0));
    hammer.on('swiperight', () => player.move(1, 0));
    // Обновление NPC каждые 500 мс
    setInterval(() => {
        updateNPCs();
        checkNPCCollision();
        drawMaze();
    }, 500);
}

function resetGame() {
    console.log("Resetting game..."); // Отладочное сообщение
    // Скрываем попап победы
    winPopup.classList.add("hidden");
    // Пересоздаем объект лабиринта
    maze = new Maze(maze.width, maze.height);
    maze.generateMaze(0, 0);
    // Сбрасываем позицию игрока
    player = new Player(0, 0);
    playerPos = { x: 0, y: 0 };
    // Сбрасываем состояние двери и прогресс анимации
    exitOpen = false;
    exitAnimationProgress = 0;
    // Очищаем массив NPC и создаем новых
    npcs = [];
    spawnNPCs(3); // Создаем 3 NPC
    // Перерисовываем лабиринт
    drawMaze();
    console.log("Game reset complete."); // Отладочное сообщение
}

class NPC {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    moveRandomly() {
        const directions = [
            { dx: 1, dy: 0 }, // Вправо
            { dx: -1, dy: 0 }, // Влево
            { dx: 0, dy: 1 }, // Вниз
            { dx: 0, dy: -1 } // Вверх
        ];
        const randomDirection = directions[Math.floor(Math.random() * directions.length)];
        const newX = this.x + randomDirection.dx;
        const newY = this.y + randomDirection.dy;
        if (newX >= 0 && newX < maze.width && newY >= 0 && newY < maze.height) {
            const currentCell = maze.grid[this.x][this.y];
            const newCell = maze.grid[newX][newY];
            if (randomDirection.dx === 1 && !currentCell.walls[1]) this.x = newX; // Вправо
            if (randomDirection.dx === -1 && !currentCell.walls[3]) this.x = newX; // Влево
            if (randomDirection.dy === 1 && !currentCell.walls[2]) this.y = newY; // Вниз
            if (randomDirection.dy === -1 && !currentCell.walls[0]) this.y = newY; // Вверх
        }
    }
}

// Функция для проверки видимости стены
function isWallVisible(cellX, cellY, wallIndex) {
    const dx = cellX - player.x;
    const dy = cellY - player.y;
    // Проверяем, находится ли клетка в пределах лабиринта
    if (cellX < 0 || cellX >= maze.width || cellY < 0 || cellY >= maze.height) {
        return false; // Клетка за пределами лабиринта
    }
    // Проверяем, есть ли стены между игроком и клеткой
    if (dx === 0) {
        // Клетка находится на одной вертикали с игроком
        const step = dy > 0 ? 1 : -1;
        for (let y = player.y + step; y !== cellY; y += step) {
            if (y < 0 || y >= maze.height) break; // Выход за пределы лабиринта
            if (maze.grid[cellX][y].walls[dy > 0 ? 0 : 2]) {
                return false; // Есть стена, клетка не видна
            }
        }
    } else if (dy === 0) {
        // Клетка находится на одной горизонтали с игроком
        const step = dx > 0 ? 1 : -1;
        for (let x = player.x + step; x !== cellX; x += step) {
            if (x < 0 || x >= maze.width) break; // Выход за пределы лабиринта
            if (maze.grid[x][cellY].walls[dx > 0 ? 3 : 1]) {
                return false; // Есть стена, клетка не видна
            }
        }
    } else {
        // Клетка находится по диагонали, проверяем обе оси
        const stepX = dx > 0 ? 1 : -1;
        const stepY = dy > 0 ? 1 : -1;
        for (let x = player.x + stepX, y = player.y + stepY; x !== cellX || y !== cellY; x += stepX, y += stepY) {
            if (x < 0 || x >= maze.width || y < 0 || y >= maze.height) break; // Выход за пределы лабиринта
            if (maze.grid[x][y].walls[stepX > 0 ? 3 : 1] || maze.grid[x][y].walls[stepY > 0 ? 0 : 2]) {
                return false; // Есть стена, клетка не видна
            }
        }
    }
    return true; // Клетка видна
}

function calculateLightIntensity(distance) {
    return Math.max(0, 1 - distance / 5); // Максимальная интенсивность на расстоянии 5 клеток
}

function drawMaze() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Отрисовка пола
    ctx.fillStyle = "#34495E";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Отрисовка подсветки
    for (let x = 0; x < maze.width; x++) {
        for (let y = 0; y < maze.height; y++) {
            const cell = maze.grid[x][y];
            const startX = x * CELL_SIZE;
            const startY = y * CELL_SIZE;

            // Подсветка стен, если игрок рядом и стена видна
            const distance = Math.sqrt((player.x - x) ** 2 + (player.y - y) ** 2);
            if (distance < 5) { // Если игрок в радиусе 5 клеток
                const lightIntensity = calculateLightIntensity(distance);
                ctx.save();
                ctx.globalAlpha = lightIntensity;
                ctx.strokeStyle = "#2980B9"; // Ярко-голубая подсветка
                ctx.lineWidth = 4;
                // Проверяем видимость каждой стены отдельно
                if (cell.walls[0] && isWallVisible(x, y - 1, 0)) { // Верхняя стена
                    ctx.strokeRect(startX, startY, CELL_SIZE, 0);
                }
                if (cell.walls[1] && isWallVisible(x + 1, y, 1)) { // Правая стена
                    ctx.strokeRect(startX + CELL_SIZE, startY, 0, CELL_SIZE);
                }
                if (cell.walls[2] && isWallVisible(x, y + 1, 2)) { // Нижняя стена
                    ctx.strokeRect(startX, startY + CELL_SIZE, CELL_SIZE, 0);
                }
                if (cell.walls[3] && isWallVisible(x - 1, y, 3)) { // Левая стена
                    ctx.strokeRect(startX, startY, 0, CELL_SIZE);
                }
                ctx.restore();
            }
        }
    }

    // Отрисовка игрока
    ctx.fillStyle = "#F39C12"; // Оранжевый цвет
    ctx.beginPath();
    ctx.arc(playerPos.x + CELL_SIZE / 2, playerPos.y + CELL_SIZE / 2, CELL_SIZE / 3, 0, Math.PI * 2);
    ctx.fill();

    // Отрисовка NPC
    ctx.fillStyle = "#FF0000"; // Красный цвет для NPC
    npcs.forEach(npc => {
        ctx.beginPath();
        ctx.arc(npc.x * CELL_SIZE + CELL_SIZE / 2, npc.y * CELL_SIZE + CELL_SIZE / 2, CELL_SIZE / 3, 0, Math.PI * 2);
        ctx.fill();
    });

    // Отрисовка выхода
    drawExit();
}

function drawExit() {
    const exitX = maze.exitX * CELL_SIZE;
    const exitY = maze.exitY * CELL_SIZE;
    // Основа двери
    ctx.fillStyle = "#2C3E50"; // Темно-синий цвет
    ctx.fillRect(exitX + 5, exitY + 5, CELL_SIZE - 10, CELL_SIZE - 10);
    // Неоновая подсветка
    ctx.strokeStyle = "#2980B9"; // Голубой цвет
    ctx.lineWidth = 2;
    ctx.strokeRect(exitX + 5, exitY + 5, CELL_SIZE - 10, CELL_SIZE - 10);
    // Анимация открытия двери
    if (exitOpen) {
        ctx.fillStyle = "rgba(46, 204, 113, 0.5)"; // Полупрозрачный зеленый
        ctx.fillRect(
            exitX + 5,
            exitY + 5 + (CELL_SIZE - 10) * exitAnimationProgress,
            CELL_SIZE - 10,
            (CELL_SIZE - 10) * (1 - exitAnimationProgress)
        );
    }
    // Индикаторы
    ctx.fillStyle = "#2ECC71"; // Зеленый цвет
    ctx.beginPath();
    ctx.arc(exitX + CELL_SIZE / 2, exitY + CELL_SIZE / 2, 5, 0, Math.PI * 2);
    ctx.fill();
}

function animatePlayer() {
    const targetX = player.x * CELL_SIZE;
    const targetY = player.y * CELL_SIZE;
    if (Math.abs(playerPos.x - targetX) > 0.1 || Math.abs(playerPos.y - targetY) > 0.1) {
        playerPos.x += (targetX - playerPos.x) * 0.2; // Плавное движение по X
        playerPos.y += (targetY - playerPos.y) * 0.2; // Плавное движение по Y
        drawMaze();
        requestAnimationFrame(animatePlayer);
    }
}

function animateExit() {
    if (exitOpen && exitAnimationProgress < 1) {
        exitAnimationProgress += 0.05; // Скорость анимации
        drawMaze();
        requestAnimationFrame(animateExit);
    }
}

function showWinPopup() {
    winPopup.classList.remove("hidden");
}

function spawnNPCs(count) {
    for (let i = 0; i < count; i++) {
        let x, y;
        do {
            x = Math.floor(Math.random() * maze.width);
            y = Math.floor(Math.random() * maze.height);
        } while (Math.sqrt((x - player.x) ** 2 + (y - player.y) ** 2) < 3); // NPC не ближе 3 клеток к игроку
        npcs.push(new NPC(x, y));
    }
}

function updateNPCs() {
    npcs.forEach(npc => npc.moveRandomly());
}

init();