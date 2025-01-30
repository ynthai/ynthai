let touchStartX, touchStartY;

document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchend', handleTouchEnd, false);

function handleTouchStart(evt) {
    touchStartX = evt.changedTouches[0].screenX;
    touchStartY = evt.changedTouches[0].screenY;
}

function handleTouchEnd(evt) {
    let touchEndX = evt.changedTouches[0].screenX;
    let touchEndY = evt.changedTouches[0].screenY;
    handleGesture(touchEndX, touchEndY);
}

function handleGesture(touchEndX, touchEndY) {
    let dx = touchEndX - touchStartX;
    let dy = touchEndY - touchStartY;

    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0) {
            moveRight();
        } else {
            moveLeft();
        }
    } else {
        if (dy > 0) {
            moveDown();
        } else {
            moveUp();
        }
    }
}

window.moveRight = moveRight;
window.moveLeft = moveLeft;
window.moveUp = moveUp;
window.moveDown = moveDown;