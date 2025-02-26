// script.js
const gameBoard = document.getElementById('game-board');
const scoreDisplay = document.getElementById('score');
let score = 0;
const gridSize = 8;
const candyColors = ['red', 'yellow', 'orange', 'purple', 'green', 'blue'];
let board = [];
let draggedElement;
let draggedElementId;
let replacedElementId;

function createBoard() {
    for (let i = 0; i < gridSize * gridSize; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.setAttribute('draggable', true);
        cell.id = i;
        const randomColor = candyColors[Math.floor(Math.random() * candyColors.length)];
        cell.innerHTML = `<img src="images/${randomColor}.png" alt="${randomColor} candy">`;
        cell.addEventListener('dragstart', dragStart);
        cell.addEventListener('dragend', dragEnd);
        cell.addEventListener('dragover', dragOver);
        cell.addEventListener('dragenter', dragEnter);
        cell.addEventListener('dragleave', dragLeave);
        cell.addEventListener('drop', dragDrop);
        gameBoard.appendChild(cell);
        board.push(randomColor);
    }
}

function dragStart(e) {
    draggedElement = e.target;
    draggedElementId = parseInt(draggedElement.id);
}

function dragEnd() {
    const validMoves = [
        draggedElementId - 1,
        draggedElementId + 1,
        draggedElementId - gridSize,
        draggedElementId + gridSize
    ];

    const validMove = validMoves.includes(replacedElementId);

    if (validMove && replacedElementId) {
        board[draggedElementId] = board[replacedElementId];
        board[replacedElementId] = draggedElement.getAttribute('alt').split(' ')[0];

        const draggedElementImage = draggedElement.innerHTML;
        const replacedElementImage = document.getElementById(replacedElementId).innerHTML;
        draggedElement.innerHTML = replacedElementImage;
        document.getElementById(replacedElementId).innerHTML = draggedElementImage;

        const validMove = checkForMatches();
        if (!validMove) {
            board[draggedElementId] = board[replacedElementId];
            board[replacedElementId] = draggedElement.getAttribute('alt').split(' ')[0];
            draggedElement.innerHTML = replacedElementImage;
            document.getElementById(replacedElementId).innerHTML = draggedElementImage;
        } else {
            score += 10;
            scoreDisplay.textContent = score;
        }
    } else {
        draggedElement.style.backgroundColor = '';
    }
    draggedElementId = null;
    replacedElementId = null;
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
}

function dragLeave() {
    draggedElement.style.backgroundColor = '';
}

function dragDrop() {
    replacedElementId = parseInt(this.id);
    this.style.backgroundColor = '';
}

function checkForMatches() {
    let columnOfFour = [];
    let columnOfThree = [];
    let rowOfFour = [];
    let rowOfThree = [];

    // Check for four in a row
    for (let i = 0; i < 60; i++) {
        let totalOne = i;
        let totalTwo = totalOne + 1;
        let totalThree = totalOne + 2;
        let totalFour = totalOne + 3;

        if (
            board[totalOne] === board[totalTwo] &&
            board[totalOne] === board[totalThree] &&
            board[totalOne] === board[totalFour] &&
            board[totalOne] !== 'empty'
        ) {
            rowOfFour.push(totalOne);
            rowOfFour.push(totalTwo);
            rowOfFour.push(totalThree);
            rowOfFour.push(totalFour);
        }
    }

    // Check for three in a row
    for (let i = 0; i < 67; i++) {
        let totalOne = i;
        let totalTwo = totalOne + 1;
        let totalThree = totalOne + 2;

        if (
            board[totalOne] === board[totalTwo] &&
            board[totalOne] === board[totalThree] &&
            board[totalOne] !== 'empty'
        ) {
            rowOfThree.push(totalOne);
            rowOfThree.push(totalTwo);
            rowOfThree.push(totalThree);
        }
    }

    // Check for four in a column
    for (let i = 0; i < 39; i++) {
        let totalOne = i;
        let totalTwo = totalOne + gridSize;
        let totalThree = totalOne + gridSize * 2;
        let totalFour = totalOne + gridSize * 3;

        if (
            board[totalOne] === board[totalTwo] &&
            board[totalOne] === board[totalThree] &&
            board[totalOne] === board[totalFour] &&
            board[totalOne] !== 'empty'
        ) {
            columnOfFour.push(totalOne);
            columnOfFour.push(totalTwo);
            columnOfFour.push(totalThree);
            columnOfFour.push(totalFour);
        }
    }

    // Check for three in a column
    for (let i = 0; i < 55; i++) {
        let totalOne = i;
        let totalTwo = totalOne + gridSize;
        let totalThree = totalOne + gridSize * 2;

        if (
            board[totalOne] === board[totalTwo] &&
            board[totalOne] === board[totalThree] &&
            board[totalOne] !== 'empty'
        ) {
            columnOfThree.push(totalOne);
            columnOfThree.push(totalTwo);
            columnOfThree.push(totalThree);
        }
    }

    if (columnOfFour.length > 0 || rowOfFour.length > 0 || columnOfThree.length > 0 || rowOfThree.length > 0) {
        score += 10;
        scoreDisplay.textContent = score;
        columnOfFour.forEach(index => {
            board[index] = 'empty';
        });
        rowOfFour.forEach(index => {
            board[index] = 'empty';
        });
        columnOfThree.forEach(index => {
            board[index] = 'empty';
        });
        rowOfThree.forEach(index => {
            board[index] = 'empty';
        });
        return true;
    }
    return false;
}

function moveDown() {
    for (let i = 0; i < 55; i++) {
        if (board[i + gridSize] === 'empty') {
            board[i + gridSize] = board[i];
            board[i] = 'empty';
        }
    }
    // Create new candies at the top
    for (let i = 0; i < 8; i++) {
        if (board[i] === 'empty') {
            const randomColor = candyColors[Math.floor(Math.random() * candyColors.length)];
            board[i] = randomColor;
            const cell = document.getElementById(i);
            cell.innerHTML = `<img src="images/${randomColor}.png" alt="${randomColor} candy">`;
        }
    }
    checkForMatches();
}

function checkBoard() {
    let timeLeft = 100;
    const timer = setInterval(() => {
        checkForMatches();
        moveDown();
        timeLeft -= 1;
        if (timeLeft === 0) {
            clearInterval(timer);
        }
    }, 100);
}

createBoard();
checkBoard();
