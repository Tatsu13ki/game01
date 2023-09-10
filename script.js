const player = document.getElementById('player');
const gameContainer = document.querySelector('.game-container');
const startButton = document.getElementById('start-button');
const healthCounter = document.getElementById('health');
let isMovingLeft = false;
let isMovingRight = false;
let isGameRunning = false;
let playerHealth = 3;

startButton.addEventListener('click', () => {
    if (!isGameRunning) {
        startGame();
    }
});

document.addEventListener('keydown', (e) => {
    if (isGameRunning) {
        if (e.key === 'ArrowLeft') {
            isMovingLeft = true;
        }
        if (e.key === 'ArrowRight') {
            isMovingRight = true;
        }
    }
});

document.addEventListener('keyup', (e) => {
    if (isGameRunning) {
        if (e.key === 'ArrowLeft') {
            isMovingLeft = false;
        }
        if (e.key === 'ArrowRight') {
            isMovingRight = false;
        }
    }
});

function movePlayer() {
    if (isMovingLeft) {
        const currentPosition = parseInt(getComputedStyle(player).left);
        if (currentPosition > 0) {
            player.style.left = `${currentPosition - 5}px`;
        }
    }
    if (isMovingRight) {
        const currentPosition = parseInt(getComputedStyle(player).left);
        if (currentPosition < gameContainer.clientWidth - player.clientWidth) {
            player.style.left = `${currentPosition + 5}px`;
        }
    }
}

function createEnemy() {
    const enemy = document.createElement('div');
    enemy.className = 'enemy';
    gameContainer.appendChild(enemy);
    const randomPosition = Math.floor(Math.random() * (gameContainer.clientWidth - 20));
    enemy.style.left = `${randomPosition}px`;
    let startTime = Date.now();

    function moveEnemy() {
        const now = Date.now();
        const elapsed = now - startTime;
        if (elapsed < 10000) {
            const currentPosition = parseInt(getComputedStyle(enemy).top);
            if (currentPosition < gameContainer.clientHeight - enemy.clientHeight) {
                enemy.style.top = `${currentPosition + 2}px`;
            } else {
                enemy.remove();
            }
            requestAnimationFrame(moveEnemy);
        } else {
            enemy.remove();
        }
    }

    requestAnimationFrame(moveEnemy);
}

function checkCollision() {
    const playerRect = player.getBoundingClientRect();
    const enemies = document.querySelectorAll('.enemy');

    enemies.forEach((enemy) => {
        const enemyRect = enemy.getBoundingClientRect();
        if (
            playerRect.left < enemyRect.right &&
            playerRect.right > enemyRect.left &&
            playerRect.top < enemyRect.bottom &&
            playerRect.bottom > enemyRect.top
        ) {
            // プレイヤーと敵の当たり判定
            playerHealth--;
            healthCounter.innerText = playerHealth; // カウンターを更新
            if (playerHealth <= 0) {
                alert('You got hit too many times! Game Over.');
                resetGame();
            } else {
                enemy.remove();
            }
        }
    });
}

function resetGame() {
    player.style.left = `${(gameContainer.clientWidth - player.clientWidth) / 2}px`; // プレイヤーを水平中央に配置
    isGameRunning = false;
    startButton.disabled = false;
    startButton.innerText = 'Start Game';
    playerHealth = 3;
    const enemies = document.querySelectorAll('.enemy');
    enemies.forEach((enemy) => {
        enemy.remove();
    });
    healthCounter.innerText = playerHealth; // カウンターをリセット
}

function startGame() {
    resetGame();
    isGameRunning = true;
    startButton.disabled = true;
    startButton.innerText = 'Game Running';
    setInterval(() => {
        if (isGameRunning) {
            createEnemy();
        }
    }, 500);
}

function gameLoop() {
    if (isGameRunning) {
        movePlayer();
        checkCollision();
    }
    requestAnimationFrame(gameLoop);
}

gameLoop();
