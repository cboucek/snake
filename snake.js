// This is a snake game made with javascript. 
// Constants
const GRID_WIDTH = 20;
const GRID_HEIGHT = 10;
const CELL_SIZE = 20;
const INITIAL_SNAKE_LENGTH = 1;

// Game variables
let snake = [];
let direction = null;
let food = null;
let score = 0;
let gameLoop = null;

// Create canvas
const canvas = document.createElement('canvas');
canvas.width = GRID_WIDTH * CELL_SIZE;
canvas.height = GRID_HEIGHT * CELL_SIZE;
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

// Create score display
const scoreDisplay = document.createElement('div');
scoreDisplay.textContent = `Score: ${score}`;
document.body.appendChild(scoreDisplay);

// Initialize game
function initGame() {
    snake = [{x: Math.floor(GRID_WIDTH / 2), y: Math.floor(GRID_HEIGHT / 2)}];
    direction = null;
    score = 0;
    generateFood();
    updateScore();
}

// Generate food at random location
function generateFood() {
    do {
        food = {
            x: Math.floor(Math.random() * GRID_WIDTH),
            y: Math.floor(Math.random() * GRID_HEIGHT)
        };
    } while (snake.some(segment => segment.x === food.x && segment.y === food.y));
}

// Update score display
function updateScore() {
    scoreDisplay.textContent = `Score: ${score}`;
}

// Game loop
function gameStep() {
    if (!direction) return;

    // Move snake
    const head = {...snake[0]};
    switch (direction) {
        case 'ArrowUp': head.y--; break;
        case 'ArrowDown': head.y++; break;
        case 'ArrowLeft': head.x--; break;
        case 'ArrowRight': head.x++; break;
    }

    // Check collision with walls or self
    if (head.x < 0 || head.x >= GRID_WIDTH || head.y < 0 || head.y >= GRID_HEIGHT ||
        snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
    }

    // Add new head
    snake.unshift(head);

    // Check if food is eaten
    if (head.x === food.x && head.y === food.y) {
        score++;
        updateScore();
        generateFood();
    } else {
        snake.pop();
    }

    // Draw game state
    draw();
}

// Draw game state
function draw() {
    // Clear canvas
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    ctx.fillStyle = 'green';
    snake.forEach(segment => {
        ctx.fillRect(segment.x * CELL_SIZE, segment.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    });

    // Draw food
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * CELL_SIZE, food.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

// Game over
function gameOver() {
    clearInterval(gameLoop);
    alert(`Game Over! Your score: ${score}`);
    initGame();
}

// Handle key presses
document.addEventListener('keydown', (event) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        if (!direction) {
            direction = event.key;
            gameLoop = setInterval(gameStep, 100);
        } else if (
            (event.key === 'ArrowUp' && direction !== 'ArrowDown') ||
            (event.key === 'ArrowDown' && direction !== 'ArrowUp') ||
            (event.key === 'ArrowLeft' && direction !== 'ArrowRight') ||
            (event.key === 'ArrowRight' && direction !== 'ArrowLeft')
        ) {
            direction = event.key;
        }
    }
});

// Initialize the game
initGame();
draw();
