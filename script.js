const basket = document.getElementById('basket');
const ball = document.getElementById('ball');
const scoreDisplay = document.getElementById('score');
const heartsContainer = document.getElementById('hearts');
const gameOverScreen = document.getElementById('game-over');
const restartButton = document.getElementById('restart-btn');

let basketX = window.innerWidth / 2 - basket.offsetWidth / 2;
let ballX = Math.random() * (window.innerWidth - 20);
let ballY = -20;
const ballSpeed = 5;
const basketSpeed = 20;
const basketWidth = basket.offsetWidth;
const basketHeight = basket.offsetHeight;
let score = 0;
let missedBalls = 0;
const maxMissedBalls = 3;
let hearts = Array.from(heartsContainer.getElementsByClassName('heart'));
let ballVelocityX = 0; // Initial horizontal velocity
let ballVelocityY = ballSpeed;

// Function to update and display the score
function updateScore(points) {
    score += points;
    scoreDisplay.textContent = 'Score: ' + score;
}

// Function to update heart indicators
function updateHearts() {
    hearts.forEach((heart, index) => {
        if (index < maxMissedBalls - missedBalls) {
            heart.style.visibility = 'visible';
        } else {
            heart.style.visibility = 'hidden';
        }
    });
}

// Function to end the game
function endGame() {
    gameOverScreen.classList.remove('hidden');
    clearInterval(gameInterval); // Stop the game loop
}

// Function to restart the game
function restartGame() {
    basketX = window.innerWidth / 2 - basket.offsetWidth / 2;
    ballX = Math.random() * (window.innerWidth - 20);
    ballY = -20;
    ballVelocityX = (Math.random() - 0.5) * ballSpeed; // Random horizontal velocity
    ballVelocityY = ballSpeed;
    score = 0;
    missedBalls = 0;
    updateScore(0);
    updateHearts();
    gameOverScreen.classList.add('hidden');
    gameInterval = setInterval(moveBall, 20); // Restart the game loop
}

// Function to move the ball
function moveBall() {
    ballX += ballVelocityX;
    ballY += ballVelocityY;
    ball.style.top = ballY + 'px';
    ball.style.left = ballX + 'px';

    if (ballY > window.innerHeight) {
        // Ball missed
        missedBalls++;
        updateHearts();

        if (missedBalls >= maxMissedBalls) {
            endGame(); // End the game if missed too many times
        } else {
            // Reset ball position
            ballY = -20;
            ballX = Math.random() * (window.innerWidth - 20);
            ballVelocityX = (Math.random() - 0.5) * ballSpeed; // Random horizontal velocity
            ballVelocityY = ballSpeed; // Reset vertical speed
        }
    }

    // Check for collision with the basket
    if (
        ballY + 20 >= window.innerHeight - basketHeight &&
        ballX + 20 > basketX &&
        ballX < basketX + basketWidth
    ) {
        // Ball caught - bounce back
        updateScore(10); // Add 10 points

        // Randomize direction
        ballVelocityY = -ballSpeed; // Bounce effect vertically
        ballVelocityX = (Math.random() - 0.5) * ballSpeed; // Random horizontal direction

        // Move the ball slightly away from the basket to prevent sticking
        ballY = window.innerHeight - basketHeight - 20; 

        // Reset ball position after bounce
        setTimeout(() => {
            ballY = -20;
            ballX = Math.random() * (window.innerWidth - 20);
            ballVelocityX = (Math.random() - 0.5) * ballSpeed; // Random horizontal velocity
            ballVelocityY = ballSpeed; // Reset vertical speed after bounce
        }, 100); // Delay for bounce effect
    }

    // Prevent the ball from moving out of bounds horizontally
    if (ballX < 0 || ballX > window.innerWidth - 20) {
        ballVelocityX = -ballVelocityX;
    }
}

// Function to move the basket
function moveBasket(e) {
    const key = e.key;

    if (key === 'ArrowLeft') {
        basketX -= basketSpeed;
    } else if (key === 'ArrowRight') {
        basketX += basketSpeed;
    }

    // Prevent basket from moving out of bounds
    if (basketX < 0) basketX = 0;
    if (basketX > window.innerWidth - basketWidth) basketX = window.innerWidth - basketWidth;

    basket.style.left = basketX + 'px';
}

// Set up the game loop
let gameInterval = setInterval(moveBall, 20);

// Listen for keyboard events
window.addEventListener('keydown', moveBasket);

// Adjust basket position on resize
window.addEventListener('resize', () => {
    basketX = Math.min(basketX, window.innerWidth - basketWidth);
    basket.style.left = basketX + 'px';
});

// Restart the game when the restart button is clicked
restartButton.addEventListener('click', restartGame);

// Initial setup
updateHearts();
