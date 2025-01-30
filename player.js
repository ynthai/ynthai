// player.js
import { CELL_SIZE } from './constants.js';

export class Player {
    constructor(startX, startY) {
        this.x = startX;
        this.y = startY;
    }

    move(dx, dy, maze) {
        const currentCell = maze.grid[this.x][this.y];
        if (dx === 1 && !currentCell.walls[1]) this.x++; // Вправо
        if (dx === -1 && !currentCell.walls[3]) this.x--; // Влево
        if (dy === 1 && !currentCell.walls[2]) this.y++; // Вниз
        if (dy === -1 && !currentCell.walls[0]) this.y--; // Вверх
    }
}