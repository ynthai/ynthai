// main.js
import { handleError } from './utils.js';
import { Maze } from './maze.js';
import { Player } from './player.js';
import { NPC } from './npc.js';
import { CELL_SIZE } from './constants.js';

const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");
let maze, player;
let playerPos = { x: 0, y: 0 }; // Позиция игрока для плавного движения
let exitOpen = false; // Состояние двери
let exitAnimationProgress = 0; // Прогресс анимации
const winPopup = document.getElementById("winPopup");
let npcs = []; // Массив для хранения NPC
// Флаг, показывающий, был ли уже запрошен доступ к вибрации
let vibrationPermissionRequested = false;

const offscreenCanvas = document.createElement('canvas');
const offscreenCtx = offscreenCanvas.getContext('2d');

function init() {
    checkVibrationPreference();
    const width = 10;
    const height = 10;
    canvas.width = width * CELL_SIZE;
    canvas.height = height * CELL_SIZE;
    offscreenCanvas.width = canvas.width;
    offscreenCanvas.height = canvas.height;
    maze = new Maze(width, height);
    maze.generateMaze(0, 0);
    player = new Player(0, 0);
    playerPos = { x: player.x * CELL_SIZE, y: player.y * CELL_SIZE };
    spawnNPCs(3); // Создаем 3 NPC
    drawMaze();
    window.addEventListener("keydown", handleKeyDown);
    setupHammerJS();
    setInterval(updateGame, 500);
    setupEventListeners();
}

function handleKeyDown(e) {
    if (e.key === "ArrowUp" || e.key === "w") player.move(0, -1, maze);
    if (e.key === "ArrowDown" || e.key === "s") player.move(0, 1, maze);
    if (e.key === "ArrowLeft" || e.key === "a") player.move(-1, 0, maze);
    if (e.key === "ArrowRight" || e.key === "d") player.move(1, 0, maze);
    animatePlayer();
    checkWin();
    checkNPCCollision();
}

function setupHammerJS() {
    const hammer = new Hammer(canvas);
    hammer.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
    hammer.on('swipeup', () => player.move(0, -1, maze));
    hammer.on('swipedown', () => player.move(0, 1, maze));
    hammer.on('swipeleft', () => player.move(-1, 0, maze));
    hammer.on('swiperight', () => player.move(1, 0, maze));
}

function updateGame() {
    updateNPCs();
    checkNPCCollision();
    drawMaze();
}

function setupEventListeners() {
    canvas.addEventListener('touchmove', preventScroll, { passive: false });
    canvas.addEventListener('wheel', preventScroll, { passive: false });
    canvas.addEventListener('mousedown', () => isDragging = true);
    canvas.addEventListener('mouseup', () => isDragging = false);
    canvas.addEventListener('mousemove', handleMouseMove);
}

function preventScroll(event) {
    event.preventDefault();
}

function handleMouseMove(event) {
    if (isDragging) {
        event.preventDefault();
    }
}

function resetGame() {
    console.log("Resetting game...");
    winPopup.classList.add("hidden");
    maze = new Maze(maze.width, maze.height);
    maze.generateMaze(0, 0);
    player = new Player(0, 0);
    playerPos = { x: 0, y: 0 };
    exitOpen = false;
    exitAnimationProgress = 0;
    npcs = [];
    spawnNPCs(3);
    drawMaze();
    console.log("Game reset complete.");
}

function spawnNPCs(count) {
    for (let i = 0; i < count; i++) {
        let x, y;
        do {
            x = Math.floor(Math.random() * maze.width);
            y = Math.floor(Math.random() * maze.height);
        } while (Math.sqrt((x - player.x) ** 2 + (y - player.y) ** 2) < 3);
        npcs.push(new NPC(x, y));
    }
}

function updateNPCs() {
    npcs.forEach(npc => npc.moveTowardPlayer(player, maze));
}

function checkNPCCollision() {
    const collision = npcs.some(npc => npc.x === player.x && npc.y === player.y);
    if (collision) {
        alert("Вас поймали! Игра окончена.");
        resetGame();
    }
}

function checkVibrationPreference() {
    if (localStorage.getItem('vibrationAllowed') === 'true') {
        vibrationPermissionRequested = true;
    } else if (localStorage.getItem('vibrationAllowed') === 'false') {
        vibrationPermissionRequested = true;
    } else {
        requestVibrationPermission();
    }
}

init();

// Остальной код для отрисовки лабиринта и других функций
function drawMaze() {
    // Очистка невидимого холста
    offscreenCtx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
    // Отрисовка пола
    offscreenCtx.fillStyle = "#34495E";
    offscreenCtx.fillRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);

    // Отрисовка подсветки
    for (let x = 0; x < maze.width; x++) {
        for (let y = 0; y < maze.height; y++) {
            const cell = maze.grid[x][y];
            const startX = x * CELL_SIZE;
            const startY = y * CELL_SIZE;
            const distance = Math.sqrt((player.x - x) ** 2 + (player.y - y) ** 2);

            if (distance < 5) { // Если игрок в радиусе 5 клеток
                const lightIntensity = calculateLightIntensity(distance);
                offscreenCtx.globalAlpha = lightIntensity;
                offscreenCtx.strokeStyle = "#2980B9"; // Ярко-голубая подсветка
                offscreenCtx.lineWidth = 4;

                const isVisible = (wallIndex, nx, ny) => {
                    return isWallVisible(x + (nx || 0), y + (ny || 0), wallIndex);
                };

                if (cell.walls[0] && isVisible(0, 0, -1)) { // Верхняя стена
                    offscreenCtx.strokeRect(startX, startY, CELL_SIZE, 0);
                }
                if (cell.walls[1] && isVisible(1, 1, 0)) { // Правая стена
                    offscreenCtx.strokeRect(startX + CELL_SIZE, startY, 0, CELL_SIZE);
                }
                if (cell.walls[2] && isVisible(2, 0, 1)) { // Нижняя стена
                    offscreenCtx.strokeRect(startX, startY + CELL_SIZE, CELL_SIZE, 0);
                }
                if (cell.walls[3] && isVisible(3, -1, 0)) { // Левая стена
                    offscreenCtx.strokeRect(startX, startY, 0, CELL_SIZE);
                }
            }
        }
    }

    // Отрисовка игрока
    offscreenCtx.fillStyle = "#F39C12"; // Оранжевый цвет
    offscreenCtx.beginPath();
    offscreenCtx.arc(playerPos.x + CELL_SIZE / 2, playerPos.y + CELL_SIZE / 2, CELL_SIZE / 3, 0, Math.PI * 2);
    offscreenCtx.fill();

    // Отрисовка NPC
    offscreenCtx.fillStyle = "#FF0000"; // Красный цвет для NPC
    npcs.forEach(npc => {
        offscreenCtx.beginPath();
        offscreenCtx.arc(npc.x * CELL_SIZE + CELL_SIZE / 2, npc.y * CELL_SIZE + CELL_SIZE / 2, CELL_SIZE / 3, 0, Math.PI * 2);
        offscreenCtx.fill();
    });

    // Отрисовка выхода
    drawExit();

    // Копирование содержимого невидимого холста на основной холст
    ctx.drawImage(offscreenCanvas, 0, 0);
}

function drawExit() {
    const exitX = maze.exitX * CELL_SIZE;
    const exitY = maze.exitY * CELL_SIZE;
    // Основа двери
    offscreenCtx.fillStyle = "#2C3E50"; // Темно-синий цвет
    offscreenCtx.fillRect(exitX + 5, exitY + 5, CELL_SIZE - 10, CELL_SIZE - 10);
    // Неоновая подсветка
    offscreenCtx.strokeStyle = "#2980B9"; // Голубой цвет
    offscreenCtx.lineWidth = 2;
    offscreenCtx.strokeRect(exitX + 5, exitY + 5, CELL_SIZE - 10, CELL_SIZE - 10);
    // Анимация открытия двери
    if (exitOpen) {
        offscreenCtx.fillStyle = "rgba(46, 204, 113, 0.5)"; // Полупрозрачный зеленый
        offscreenCtx.fillRect(
            exitX + 5,
            exitY + 5 + (CELL_SIZE - 10) * exitAnimationProgress,
            CELL_SIZE - 10,
            (CELL_SIZE - 10) * (1 - exitAnimationProgress)
        );
    }
    // Индикаторы
    offscreenCtx.fillStyle = "#2ECC71"; // Зеленый цвет
    offscreenCtx.beginPath();
    offscreenCtx.arc(exitX + CELL_SIZE / 2, exitY + CELL_SIZE / 2, 5, 0, Math.PI * 2);
    offscreenCtx.fill();
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

function calculateLightIntensity(distance) {
    return Math.max(0, 1 - distance / 5); // Максимальная интенсивность на расстоянии 5 клеток
}

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

function checkWin() {
    if (maze.isExit(player.x, player.y)) {
        exitOpen = true;
        animateExit();
        setTimeout(showWinPopup, 1000); // Показываем попап через 1 секунду
    }
}