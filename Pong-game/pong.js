const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

// Game objects
const paddleWidth = 12;
const paddleHeight = 80;
const ballRadius = 10;

// Left paddle (Player)
const player = {
    x: 0,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: "#00ff99"
};

// Right paddle (AI)
const ai = {
    x: canvas.width - paddleWidth,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: "#ff5050"
};

// Ball
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: ballRadius,
    speed: 5,
    velocityX: 5,
    velocityY: 5,
    color: "#fff"
};

// Scores (not displayed, but can be added easily)
let playerScore = 0;
let aiScore = 0;

// Draw functions
function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}
function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}
function drawNet() {
    ctx.fillStyle = "#fff";
    for (let i = 0; i < canvas.height; i += 24) {
        ctx.fillRect(canvas.width / 2 - 1, i, 2, 12);
    }
}

// Reset Ball
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    // Reverse direction to last scorer
    ball.velocityX = -ball.velocityX;
    ball.velocityY = 5 * (Math.random() > 0.5 ? 1 : -1);
}

// Collision detection
function collision(b, p) {
    return (
        b.x - b.radius < p.x + p.width &&
        b.x + b.radius > p.x &&
        b.y - b.radius < p.y + p.height &&
        b.y + b.radius > p.y
    );
}

// Move AI paddle
function moveAI() {
    // Simple AI: Move towards the ball with some smoothing
    let target = ball.y - ai.height / 2;
    ai.y += (target - ai.y) * 0.08;
    // Clamp AI paddle within canvas
    ai.y = Math.max(0, Math.min(canvas.height - ai.height, ai.y));
}

// Mouse control for player
canvas.addEventListener("mousemove", evt => {
    const rect = canvas.getBoundingClientRect();
    let scaleY = canvas.height / rect.height;
    let mouseY = (evt.clientY - rect.top) * scaleY;
    player.y = mouseY - player.height / 2;
    // Clamp player's paddle within the canvas
    player.y = Math.max(0, Math.min(canvas.height - player.height, player.y));
});

// Main update
function update() {
    // Move ball
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // Ball collision with top/bottom walls
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.velocityY = -ball.velocityY;
    }

    // Ball collision with paddles
    let paddle = ball.x < canvas.width / 2 ? player : ai;
    if (collision(ball, paddle)) {
        // Calculate collision point
        let collidePoint = ball.y - (paddle.y + paddle.height / 2);
        collidePoint = collidePoint / (paddle.height / 2);

        // Calculate angle in Radian
        let angleRad = (Math.PI / 4) * collidePoint;

        // Direction
        let direction = ball.x < canvas.width / 2 ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);

        // Slightly increase ball speed
        ball.speed += 0.2;
    }

    // Score update
    if (ball.x - ball.radius < 0) {
        aiScore++;
        ball.speed = 5;
        resetBall();
    }
    if (ball.x + ball.radius > canvas.width) {
        playerScore++;
        ball.speed = 5;
        resetBall();
    }

    // Move AI paddle
    moveAI();
}

// Render
function render() {
    // Clear canvas
    drawRect(0, 0, canvas.width, canvas.height, "#111");
    drawNet();

    // Draw paddles and ball
    drawRect(player.x, player.y, player.width, player.height, player.color);
    drawRect(ai.x, ai.y, ai.width, ai.height, ai.color);
    drawCircle(ball.x, ball.y, ball.radius, ball.color);

    // Optionally draw scores (uncomment below to show scores)
    /*
    ctx.font = "32px Arial";
    ctx.fillText(playerScore, canvas.width / 4, 40);
    ctx.fillText(aiScore, 3 * canvas.width / 4, 40);
    */
}

// Game loop
function game() {
    update();
    render();
    requestAnimationFrame(game);
}

// Start game
game();