// main.js
import { handleError } from './utils.js';
import { Maze } from './maze.js';
import { Player } from './player.js';
import { NPC } from './npc.js';

const CELL_SIZE = 30; // Размер клетки в пикселях
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