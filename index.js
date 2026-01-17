const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const healthDisplay = document.getElementById('health');
const scoreDisplay = document.getElementById('score');

// Game variables
let player = { x: 100, y: 100, width: 32, height: 32, health: 100, speed: 5 };
let enemies = [];
let items = [];
let score = 0;
let keys = {};

// Generate random enemies and items
function initGame() {
    for (let i = 0; i < 5; i++) {
        enemies.push({
            x: Math.random() * (canvas.width - 32),
            y: Math.random() * (canvas.height - 32),
            width: 32,
            height: 32,
            health: 20
        });
    }
    for (let i = 0; i < 3; i++) {
        items.push({
            x: Math.random() * (canvas.width - 16),
            y: Math.random() * (canvas.height - 16),
            width: 16,
            height: 16,
            type: 'health'
        });
    }
}

// Handle input
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    if (e.key === ' ') {
        attack();
    }
});
document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Player movement
function updatePlayer() {
    if (keys.ArrowUp && player.y > 0) player.y -= player.speed;
    if (keys.ArrowDown && player.y < canvas.height - player.height) player.y += player.speed;
    if (keys.ArrowLeft && player.x > 0) player.x -= player.speed;
    if (keys.ArrowRight && player.x < canvas.width - player.width) player.x += player.speed;
}

// Attack nearby enemies
function attack() {
    enemies.forEach((enemy, index) => {
        if (Math.abs(player.x - enemy.x) < 50 && Math.abs(player.y - enemy.y) < 50) {
            enemy.health -= 10;
            if (enemy.health <= 0) {
                enemies.splice(index, 1);
                score += 10;
                scoreDisplay.textContent = score;
            }
        }
    });
}

// Check collisions with items
function checkItems() {
    items.forEach((item, index) => {
        if (Math.abs(player.x - item.x) < 32 && Math.abs(player.y - item.y) < 32) {
            if (item.type === 'health') {
                player.health = Math.min(100, player.health + 20);
                healthDisplay.textContent = player.health;
            }
            items.splice(index, 1);
        }
    });
}

// Draw everything
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw player
    ctx.fillStyle = 'blue';
    ctx.fillRect(player.x, player.y, player.width, player.height);
    
    // Draw enemies
    ctx.fillStyle = 'red';
    enemies.forEach(enemy => {
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    });
    
    // Draw items
    ctx.fillStyle = 'green';
    items.forEach(item => {
        ctx.fillRect(item.x, item.y, item.width, item.height);
    });
}

// Game loop
function gameLoop() {
    updatePlayer();
    checkItems();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start game
initGame();
gameLoop();