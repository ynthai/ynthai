// maze.js
import { CELL_SIZE } from './constants.js';

class Cell {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.walls = [true, true, true, true]; // Верх, право, низ, лево
        this.visited = false;
    }
}

export class Maze {
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