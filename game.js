// Game Configuration
const CONFIG = {
    container: null,
    farmer: null,
    gameScreen: null,
    gameElements: null,
    scoreBoard: null,
    currentScore: null,
    highScore: null,
    startScreen: null,
    gameOverScreen: null,
    statusIndicator: null,
    weatherEffect: null,
    sky: null,
    
    // Game State
    gameRunning: false,
    score: 0,
    highScore: 0,
    farmerX: 50,
    farmerSpeed: 8,
    baseSpeed: 3,
    currentSpeed: 3,
    
    // Movement
    movingLeft: false,
    movingRight: false,
    
    // Objects
    tbsList: [],
    obstacleList: [],
    
    // Timing
    lastTBSpawn: 0,
    lastObstacleSpawn: 0,
    tbsSpawnInterval: 1500,
    obstacleSpawnInterval: 2000,
    
    // Difficulty
    difficultyLevel: 1,
    
    // Weather
    weatherActive: false,
    weatherType: null,
    weatherTimer: 0,
    
    // Collision tracking
    recentHits: [],
    
    // Sound
    bgMusic: null,
    musicPlaying: false,
    
    // Educational messages
    tbsMessages: [
        "TBS segar = minyak berkualitas!",
        "Bagus! TBS berkualitas tinggi!",
        "Kelaz WOK!",
        "TBS baik untuk industri minyak!"
    ],
    obstacleMessages: [
        "Hama bisa merusak TBS!",
        "Cabang kayu berbahaya!",
        "Genangan air membuat jalan licin!",
        "NYAWIT NIH ORANG!",
        "Salah ambil buah!",
        "Hati-hati!"
    ],
    gameOverMessages: [
        "Petani sawit bekerja keras setiap hari untuk memenuhi kebutuhan kita akan produk kelapa sawit yang berkelanjutan.",
        "TBS yang dipetik segera diolah menghasilkan minyak sawit berkualitas premium.",
        "Perkebunan berkelanjutan menjaga lingkungan sambil memenuhi kebutuhan ekonomi."
    ]
};

// DOM Elements
const elements = {};

// Initialize Game
function init() {
    // Cache DOM elements
    elements.container = document.getElementById('game-container');
    elements.gameScreen = document.getElementById('game-screen');
    elements.gameElements = document.getElementById('game-elements');
    elements.currentScore = document.getElementById('current-score');
    elements.highScore = document.getElementById('high-score');
    elements.startScreen = document.getElementById('start-screen');
    elements.gameOverScreen = document.getElementById('game-over-screen');
    elements.statusIndicator = document.getElementById('status-indicator');
    elements.weatherEffect = document.getElementById('weather-effect');
    elements.sky = document.getElementById('sky');
    elements.farmer = document.getElementById('farmer');
    
    // Get saved high score
    CONFIG.highScore = parseInt(localStorage.getItem('priaSawitHighScore')) || 0;
    elements.highScore.textContent = CONFIG.highScore;
    
    // Initialize background music
    initSound();
    setupSoundControls();
    
    // Event Listeners
    document.getElementById('start-btn').addEventListener('click', startGame);
    document.getElementById('restart-btn').addEventListener('click', restartGame);
    
    // Keyboard controls
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    // Touch/Button controls
    document.getElementById('left-btn').addEventListener('touchstart', (e) => {
        e.preventDefault();
        CONFIG.movingLeft = true;
        elements.farmer.classList.add('walking');
    });
    document.getElementById('left-btn').addEventListener('touchend', () => {
        CONFIG.movingLeft = false;
        elements.farmer.classList.remove('walking');
    });
    document.getElementById('left-btn').addEventListener('mousedown', () => {
        CONFIG.movingLeft = true;
        elements.farmer.classList.add('walking');
    });
    document.getElementById('left-btn').addEventListener('mouseup', () => {
        CONFIG.movingLeft = false;
        elements.farmer.classList.remove('walking');
    });
    document.getElementById('left-btn').addEventListener('mouseleave', () => {
        CONFIG.movingLeft = false;
        elements.farmer.classList.remove('walking');
    });
    
    document.getElementById('right-btn').addEventListener('touchstart', (e) => {
        e.preventDefault();
        CONFIG.movingRight = true;
        elements.farmer.classList.add('walking');
    });
    document.getElementById('right-btn').addEventListener('touchend', () => {
        CONFIG.movingRight = false;
        elements.farmer.classList.remove('walking');
    });
    document.getElementById('right-btn').addEventListener('mousedown', () => {
        CONFIG.movingRight = true;
        elements.farmer.classList.add('walking');
    });
    document.getElementById('right-btn').addEventListener('mouseup', () => {
        CONFIG.movingRight = false;
        elements.farmer.classList.remove('walking');
    });
    document.getElementById('right-btn').addEventListener('mouseleave', () => {
        CONFIG.movingRight = false;
        elements.farmer.classList.remove('walking');
    });
    
    // Window resize
    window.addEventListener('resize', handleResize);
    handleResize();
    
    // Visibility change - pause when tab hidden
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && CONFIG.gameRunning) {
            // Pause logic could be added here
        }
    });
}

// Handle window resize
function handleResize() {
    const containerWidth = elements.container.offsetWidth;
    const containerHeight = elements.container.offsetHeight;
    
    // Update farmer boundaries (road is 20% to 80% of container width)
    CONFIG.roadLeft = containerWidth * 0.22;
    CONFIG.roadRight = containerWidth * 0.78;
    CONFIG.containerHeight = containerHeight;
}

// Keyboard handlers
function handleKeyDown(e) {
    if (!CONFIG.gameRunning) return;
    
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        CONFIG.movingLeft = true;
        elements.farmer.classList.add('walking');
    }
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        CONFIG.movingRight = true;
        elements.farmer.classList.add('walking');
    }
}

function handleKeyUp(e) {
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        CONFIG.movingLeft = false;
        elements.farmer.classList.remove('walking');
    }
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        CONFIG.movingRight = false;
        elements.farmer.classList.remove('walking');
    }
}

// Start Game
function startGame() {
    elements.startScreen.classList.add('hidden');
    CONFIG.gameRunning = true;
    CONFIG.score = 0;
    CONFIG.currentSpeed = CONFIG.baseSpeed;
    CONFIG.difficultyLevel = 1;
    CONFIG.lastTBSpawn = 0;
    CONFIG.lastObstacleSpawn = 0;
    CONFIG.tbsList = [];
    CONFIG.obstacleList = [];
    CONFIG.recentHits = [];
    CONFIG.weatherActive = false;
    CONFIG.weatherType = null;
    
    // Clear existing game elements
    elements.gameElements.innerHTML = '';
    
    // Reset farmer position
    CONFIG.farmerX = 50;
    updateFarmerPosition();
    
    // Update score display
    elements.currentScore.textContent = '0';
    
    // Start game loop
    requestAnimationFrame(gameLoop);
    
    // Play background music
    playBackgroundMusic();
    
    // Show initial message
    showStatus("Siaga Ambil TBS!", "info");
}

// Restart Game
function restartGame() {
    elements.gameOverScreen.classList.add('hidden');
    startGame();
}

// Game Loop
let lastTime = 0;
function gameLoop(timestamp) {
    if (!CONFIG.gameRunning) return;
    
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    
    // Update farmer position
    updateFarmerPosition();
    
    // Spawn TBS
    if (timestamp - CONFIG.lastTBSpawn > CONFIG.tbsSpawnInterval) {
        spawnTBS();
        CONFIG.lastTBSpawn = timestamp;
    }
    
    // Spawn obstacles
    if (timestamp - CONFIG.lastObstacleSpawn > CONFIG.obstacleSpawnInterval) {
        spawnObstacle();
        CONFIG.lastObstacleSpawn = timestamp;
    }
    
    // Update game objects
    updateTBS();
    updateObstacles();
    
    // Update weather
    updateWeather(timestamp);
    
    // Update difficulty
    updateDifficulty();
    
    // Check for game over
    checkGameOver();
    
    // Continue game loop
    requestAnimationFrame(gameLoop);
}

// Update Farmer Position
function updateFarmerPosition() {
    const containerWidth = elements.container.offsetWidth;
    const moveAmount = (CONFIG.farmerSpeed / containerWidth) * 100;
    
    if (CONFIG.movingLeft) {
        CONFIG.farmerX = Math.max(CONFIG.farmerX - moveAmount, 5);
    }
    if (CONFIG.movingRight) {
        CONFIG.farmerX = Math.min(CONFIG.farmerX + moveAmount, 95);
    }
    
    elements.farmer.style.left = CONFIG.farmerX + '%';
}

// Spawn TBS
function spawnTBS() {
    const tbs = document.createElement('div');
    tbs.className = 'tbs';
    
    const xPos = 15 + Math.random() * 70;
    tbs.style.left = xPos + '%';
    tbs.style.top = '-40px';
    
    // Vary animation duration based on speed
    const duration = (600 / CONFIG.currentSpeed) + Math.random() * 0.5;
    tbs.style.animationDuration = duration + 's';
    
    tbs.innerHTML = '<img src="sawit.png" alt="TBS" style="width:100%;height:100%;object-fit:contain;">';
    
    elements.gameElements.appendChild(tbs);
    
    CONFIG.tbsList.push({
        element: tbs,
        x: xPos,
        y: -4,
        speed: CONFIG.currentSpeed,
        collected: false
    });
}

// Spawn Obstacle
function spawnObstacle() {
    const types = ['hama', 'cabang', 'air'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    const obstacle = document.createElement('div');
    obstacle.className = 'obstacle ' + type;
    
    const xPos = 15 + Math.random() * 70;
    obstacle.style.left = xPos + '%';
    obstacle.style.top = '-30px';
    
    const duration = (600 / CONFIG.currentSpeed) + Math.random() * 0.5;
    obstacle.style.animationDuration = duration + 's';
    
    obstacle.innerHTML = '<div class="obstacle-body"></div>';
    
    elements.gameElements.appendChild(obstacle);
    
    CONFIG.obstacleList.push({
        element: obstacle,
        x: xPos,
        y: -3,
        speed: CONFIG.currentSpeed,
        type: type
    });
}

// Update TBS
function updateTBS() {
    const containerHeight = elements.container.offsetHeight;
    const farmerRect = elements.farmer.getBoundingClientRect();
    
    for (let i = CONFIG.tbsList.length - 1; i >= 0; i--) {
        const tbs = CONFIG.tbsList[i];
        
        // Move TBS down
        tbs.y += (tbs.speed / containerHeight) * 100 * 0.016 * 60;
        tbs.element.style.top = tbs.y + '%';
        
        // Check collision with farmer
        if (!tbs.collected && checkCollision(tbs, farmerRect)) {
            collectTBS(tbs, i);
            continue;
        }
        
        // Remove if off screen
        if (tbs.y > 110) {
            tbs.element.remove();
            CONFIG.tbsList.splice(i, 1);
        }
    }
}

// Update Obstacles
function updateObstacles() {
    const containerHeight = elements.container.offsetHeight;
    const farmerRect = elements.farmer.getBoundingClientRect();
    
    for (let i = CONFIG.obstacleList.length - 1; i >= 0; i--) {
        const obstacle = CONFIG.obstacleList[i];
        
        // Move obstacle down
        obstacle.y += (obstacle.speed / containerHeight) * 100 * 0.016 * 60;
        obstacle.element.style.top = obstacle.y + '%';
        
        // Check collision with farmer
        if (checkObstacleCollision(obstacle, farmerRect)) {
            hitObstacle(obstacle, i);
            continue;
        }
        
        // Remove if off screen
        if (obstacle.y > 110) {
            obstacle.element.remove();
            CONFIG.obstacleList.splice(i, 1);
        }
    }
}

// Check collision (TBS)
function checkCollision(tbs, farmerRect) {
    const tbsRect = tbs.element.getBoundingClientRect();
    
    return !(tbsRect.right < farmerRect.left || 
            tbsRect.left > farmerRect.right || 
            tbsRect.bottom < farmerRect.top || 
            tbsRect.top > farmerRect.bottom);
}

// Check collision (obstacles)
function checkObstacleCollision(obstacle, farmerRect) {
    const obstacleRect = obstacle.element.getBoundingClientRect();
    
    return !(obstacleRect.right < farmerRect.left + 10 || 
            obstacleRect.left > farmerRect.right - 10 || 
            obstacleRect.bottom < farmerRect.top + 10 || 
            obstacleRect.top > farmerRect.bottom);
}

// Collect TBS
function collectTBS(tbs, index) {
    tbs.collected = true;
    tbs.element.classList.add('collected');
    
    // Add score
    CONFIG.score += 5;
    elements.currentScore.textContent = CONFIG.score;
    
    // Show score popup
    showScorePopup(tbs.x, '+5', true);
    
    // Show status message
    const message = CONFIG.tbsMessages[Math.floor(Math.random() * CONFIG.tbsMessages.length)];
    showStatus(message, "positive");
    
    // Remove after animation
    setTimeout(() => {
        tbs.element.remove();
        const idx = CONFIG.tbsList.indexOf(tbs);
        if (idx > -1) CONFIG.tbsList.splice(idx, 1);
    }, 300);
}

// Hit by obstacle
function hitObstacle(obstacle, index) {
    obstacle.element.remove();
    CONFIG.obstacleList.splice(index, 1);
    
    // Add to recent hits
    CONFIG.recentHits.push(Date.now());
    
    // Reduce score
    CONFIG.score -= 10;
    elements.currentScore.textContent = CONFIG.score;
    
    // Visual feedback
    elements.farmer.classList.add('hit');
    elements.gameScreen.classList.add('shake');
    
    setTimeout(() => {
        elements.farmer.classList.remove('hit');
        elements.gameScreen.classList.remove('shake');
    }, 300);
    
    // Show score popup
    showScorePopup(obstacle.x, '-10', false);
    
    // Show status message
    const message = CONFIG.obstacleMessages[Math.floor(Math.random() * CONFIG.obstacleMessages.length)];
    showStatus(message, "negative");
    
    // Check for game over from consecutive hits
    const now = Date.now();
    CONFIG.recentHits = CONFIG.recentHits.filter(time => now - time < 2000);
    
    if (CONFIG.score < 0) {
        gameOver();
    }
}

// Show score popup
function showScorePopup(x, text, positive) {
    const popup = document.createElement('div');
    popup.className = 'score-popup ' + (positive ? 'positive' : 'negative');
    popup.textContent = text;
    popup.style.left = x + '%';
    popup.style.top = '60%';
    
    elements.gameScreen.appendChild(popup);
    
    setTimeout(() => popup.remove(), 800);
}

// Show status message
function showStatus(message, type) {
    elements.statusIndicator.textContent = message;
    elements.statusIndicator.className = 'show ' + type;
    
    setTimeout(() => {
        elements.statusIndicator.classList.remove('show');
    }, 2000);
}

// Update difficulty
function updateDifficulty() {
    const newLevel = Math.floor(CONFIG.score / 20) + 1;
    
    if (newLevel > CONFIG.difficultyLevel) {
        CONFIG.difficultyLevel = newLevel;
        CONFIG.currentSpeed = CONFIG.baseSpeed * (1 + (newLevel - 1) * 0.1);
        
        // Adjust spawn intervals
        CONFIG.tbsSpawnInterval = Math.max(800, 1500 - (newLevel - 1) * 100);
        CONFIG.obstacleSpawnInterval = Math.max(1000, 2000 - (newLevel - 1) * 150);
    }
}

// Update weather
function updateWeather(timestamp) {
    // Activate weather after score 30
    if (CONFIG.score >= 30 && !CONFIG.weatherActive) {
        CONFIG.weatherActive = true;
        startWeather();
    }
    
    // Change weather every 10 seconds
    if (CONFIG.weatherActive && timestamp - CONFIG.weatherTimer > 10000) {
        CONFIG.weatherTimer = timestamp;
        changeWeather();
    }
    
    // Weather affects speed
    if (CONFIG.weatherActive && CONFIG.weatherType === 'rain') {
        CONFIG.currentSpeed = CONFIG.baseSpeed * 1.15;
    }
}

// Start weather
function startWeather() {
    elements.weatherEffect.classList.add('active');
    CONFIG.weatherTimer = performance.now();
    changeWeather();
}

// Change weather
function changeWeather() {
    const isRain = Math.random() > 0.5;
    
    // Clear existing weather
    elements.weatherEffect.innerHTML = '';
    elements.sky.className = 'bg-layer sky';
    
    if (isRain) {
        CONFIG.weatherType = 'rain';
        elements.sky.classList.add('rainy');
        
        // Create rain drops
        for (let i = 0; i < 50; i++) {
            const drop = document.createElement('div');
            drop.className = 'rain-drop';
            drop.style.left = Math.random() * 100 + '%';
            drop.style.animationDelay = Math.random() * 0.5 + 's';
            elements.weatherEffect.appendChild(drop);
        }
    } else {
        CONFIG.weatherType = 'heat';
        elements.sky.classList.add('hot');
        
        // Create heat wave
        const heat = document.createElement('div');
        heat.className = 'heat-wave';
        elements.weatherEffect.appendChild(heat);
    }
}

// Check Game Over
function checkGameOver() {
    // Game over if score is negative
    if (CONFIG.score < 0) {
        gameOver();
    }
    
    // Game over if too many hits in quick succession
    if (CONFIG.recentHits.length >= 3) {
        gameOver();
    }
}

// Game Over
function gameOver() {
    CONFIG.gameRunning = false;
    
    // Check for new high score
    const isNewRecord = CONFIG.score > CONFIG.highScore;
    
    if (isNewRecord) {
        CONFIG.highScore = CONFIG.score;
        localStorage.setItem('priaSawitHighScore', CONFIG.highScore);
        elements.highScore.textContent = CONFIG.highScore;
    }
    
    // Update game over screen
    document.getElementById('final-score').textContent = Math.max(0, CONFIG.score);
    document.getElementById('final-high-score').textContent = CONFIG.highScore;
    
    const newRecordEl = document.getElementById('new-record');
    if (isNewRecord) {
        newRecordEl.classList.remove('hidden');
    } else {
        newRecordEl.classList.add('hidden');
    }
    
    // Random educational message
    const eduMessage = CONFIG.gameOverMessages[Math.floor(Math.random() * CONFIG.gameOverMessages.length)];
    document.getElementById('edu-message').textContent = eduMessage;
    
    // Show game over screen
    setTimeout(() => {
        elements.gameOverScreen.classList.remove('hidden');
    }, 500);
}

// Start when DOM is ready
document.addEventListener('DOMContentLoaded', init);

// ========== SOUND FUNCTIONS ==========

// Initialize sound
function initSound() {
    CONFIG.bgMusic = new Audio('Sound Sawit.mp3');
    CONFIG.bgMusic.loop = true;
    CONFIG.bgMusic.volume = 0.5;
}

// Setup sound toggle control
function setupSoundControls() {
    // Create sound toggle button
    const soundBtn = document.createElement('button');
    soundBtn.id = 'sound-btn';
    soundBtn.innerHTML = '🔊';
    soundBtn.style.cssText = `
        position: absolute;
        top: 50px;
        right: 10px;
        width: 40px;
        height: 40px;
        border: none;
        border-radius: 50%;
        background: rgba(0,0,0,0.5);
        color: white;
        font-size: 18px;
        cursor: pointer;
        z-index: 100;
    `;
    
    soundBtn.addEventListener('click', toggleSound);
    document.getElementById('game-container').appendChild(soundBtn);
}

// Toggle sound on/off
function toggleSound() {
    const soundBtn = document.getElementById('sound-btn');
    
    if (CONFIG.musicPlaying) {
        CONFIG.bgMusic.pause();
        CONFIG.musicPlaying = false;
        soundBtn.innerHTML = '🔇';
    } else {
        CONFIG.bgMusic.play().catch(e => console.log('Audio play failed:', e));
        CONFIG.musicPlaying = true;
        soundBtn.innerHTML = '🔊';
    }
}

// Start background music
function playBackgroundMusic() {
    if (!CONFIG.musicPlaying && CONFIG.bgMusic) {
        CONFIG.bgMusic.play().catch(e => console.log('Audio play failed:', e));
        CONFIG.musicPlaying = true;
    }
}

// Stop background music
function stopBackgroundMusic() {
    if (CONFIG.bgMusic) {
        CONFIG.bgMusic.pause();
        CONFIG.musicPlaying = false;
    }
}
