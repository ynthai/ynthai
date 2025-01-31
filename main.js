const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 500;
canvas.height = 500;

let player = { x: 10, y: 10 };
let npc = { x: 40, y: 40 };

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'blue';
    ctx.fillRect(player.x, player.y, 20, 20);
    ctx.fillStyle = 'red';
    ctx.fillRect(npc.x, npc.y, 20, 20);
}

const directions = {
    ArrowUp: { x: 0, y: -10 },
    ArrowDown: { x: 0, y: 10 },
    ArrowLeft: { x: -10, y: 0 },
    ArrowRight: { x: 10, y: 0 }
};

function logEvent(eventName, data) {
    console.log(`[${new Date().toISOString()}] ${eventName}:`, data);
}

function monitorPerformance(callback) {
    const startTime = performance.now();
    callback();
    const endTime = performance.now();
    logEvent('Performance', { duration: endTime - startTime });
}

document.addEventListener('keydown', function(event) {
    const delta = directions[event.key];
    if (delta) {
        player.x += delta.x;
        player.y += delta.y;
        monitorPerformance(draw);
        logEvent('Player moved', { x: player.x, y: player.y });
    }
});

function moveNpc() {
    const directions = ['up', 'down', 'left', 'right'];
    const randomDirection = directions[Math.floor(Math.random() * directions.length)];
    let deltaX = 0, deltaY = 0;
    
    switch (randomDirection) {
        case 'up':
            deltaY = -10;
            break;
        case 'down':
            deltaY = 10;
            break;
        case 'left':
            deltaX = -10;
            break;
        case 'right':
            deltaX = 10;
            break;
    }

    // Ограничение границ
    if (npc.x + deltaX >= 0 && npc.x + deltaX <= canvas.width - 20 &&
        npc.y + deltaY >= 0 && npc.y + deltaY <= canvas.height - 20) {
        npc.x += deltaX;
        npc.y += deltaY;
    }
    monitorPerformance(draw);
    logEvent('NPC moved', { x: npc.x, y: npc.y });
}

setInterval(moveNpc, 1000);
monitorPerformance(draw);