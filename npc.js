// npc.js
import { CELL_SIZE } from './constants.js';
import { Maze } from './maze.js';

export class NPC {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    moveTowardPlayer(player, maze) {
        const directions = [
            { dx: 1, dy: 0 }, // Вправо
            { dx: -1, dy: 0 }, // Влево
            { dx: 0, dy: 1 }, // Вниз
            { dx: 0, dy: -1 } // Вверх
        ];

        let bestDirection = null;
        let minDistance = Infinity;

        directions.forEach(direction => {
            const newX = this.x + direction.dx;
            const newY = this.y + direction.dy;

            if (newX >= 0 && newX < maze.width && newY >= 0 && newY < maze.height) {
                const currentCell = maze.grid[this.x][this.y];
                const newCell = maze.grid[newX][newY];

                if ((direction.dx === 1 && !currentCell.walls[1]) || 
                    (direction.dx === -1 && !currentCell.walls[3]) ||
                    (direction.dy === 1 && !currentCell.walls[2]) ||
                    (direction.dy === -1 && !currentCell.walls[0])) {

                    const distance = Math.sqrt((newX - player.x) ** 2 + (newY - player.y) ** 2);
                    if (distance < minDistance) {
                        minDistance = distance;
                        bestDirection = direction;
                    }
                }
            }
        });

        if (bestDirection) {
            this.x += bestDirection.dx;
            this.y += bestDirection.dy;
        }
    }
}