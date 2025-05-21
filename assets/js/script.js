// Global DOM Element Cache
let boardElement, scoreDisplay, timeDisplay, startBtnElement, restartBtnElement, instructionBtnElement, muteIconElement, instructionsModal, modalCloseBtn;
let successSound, gameOverLosingSound, gameOverWinningSound, trumpInstructionsSound; // Main audio elements
let allGameSounds = []; // Array to hold all manageable game audio elements

// Game State Variables
let politicianTile;
let reporterTiles = [];
let score = 0;
let gameOver = false;
let timeLeft = 60;
let politicianClicks = 0;
let gameStarted = false;

// Interval IDs
let politicianMoveInterval = null;
let reporterSpawnInterval = null;
let countdownTimerInterval = null;

// Sound State
let isMuted = false;

document.addEventListener("DOMContentLoaded", function() {
    // Initialize cached DOM elements
    boardElement = document.getElementById("board");
    scoreDisplay = document.getElementById("score");
    timeDisplay = document.getElementById("time");
    startBtnElement = document.getElementById("startBtn");
    restartBtnElement = document.getElementById("restartBtn");
    instructionBtnElement = document.getElementById("instructionBtn");
    muteIconElement = document.getElementById("muteIcon");
    instructionsModal = document.getElementById("instructionsModal");
    modalCloseBtn = document.querySelector(".close");

    // Initialize audio elements
    successSound = document.getElementById("success");
    gameOverLosingSound = document.getElementById("gameOverLosingSound");
    gameOverWinningSound = document.getElementById("gameOverWinningSound");
    trumpInstructionsSound = document.getElementById("trumpInstructions");

    // Populate allGameSounds array (add any other game-controlled sounds here if they exist)
    // Ensure these elements exist in your HTML
    if (successSound) allGameSounds.push(successSound);
    if (gameOverLosingSound) allGameSounds.push(gameOverLosingSound);
    if (gameOverWinningSound) allGameSounds.push(gameOverWinningSound);
    if (trumpInstructionsSound) allGameSounds.push(trumpInstructionsSound);


    // Initial setup
    createGameBoard();
    updateScoreAndTimeDisplay();

    // Event Listeners
    startBtnElement.addEventListener("click", startGame);
    restartBtnElement.addEventListener("click", restartGame);
    instructionBtnElement.addEventListener("click", openInstructions);
    modalCloseBtn.addEventListener("click", closeInstructions);
    window.addEventListener("click", outsideClickCloseModal);
    muteIconElement.addEventListener("click", toggleMute);
});

function playSound(soundToPlay) {
    if (!soundToPlay) return;

    // Stop all other managed game sounds
    allGameSounds.forEach(audioEl => {
        if (audioEl && audioEl !== soundToPlay && !audioEl.paused) {
            audioEl.pause();
            audioEl.currentTime = 0;
        }
    });

    // Play the requested sound if not muted
    if (!isMuted) {
        soundToPlay.currentTime = 0; // Ensure it plays from the start
        soundToPlay.play().catch(error => {
            // Autoplay-related errors are common, especially if user hasn't interacted with the page
            console.error("Error playing sound '" + soundToPlay.id + "':", error);
        });
    }
}

function updateScoreAndTimeDisplay() {
    if (scoreDisplay) scoreDisplay.innerText = score;
    if (timeDisplay) timeDisplay.innerText = timeLeft;
}

function startGame() {
    if (gameStarted) return;

    gameStarted = true;
    gameOver = false;
    startBtnElement.disabled = true;

    score = 0;
    timeLeft = 60;
    politicianClicks = 0;
    updateScoreAndTimeDisplay();
    clearBoardOfCharacters();

    // Stop any sounds that might be playing (e.g., instructions) when game starts
    allGameSounds.forEach(audioEl => {
        if (audioEl && !audioEl.paused) {
            audioEl.pause();
            audioEl.currentTime = 0;
        }
    });

    startCountdownTimer();
    startMovingTimers();
    movePolitician();
}

function createGameBoard() {
    if (!boardElement) return;
    boardElement.innerHTML = "";
    for (let i = 0; i < 9; i++) {
        let tile = document.createElement("div");
        tile.id = String(i);
        tile.classList.add("tile");
        tile.addEventListener("click", tileClicked);
        boardElement.appendChild(tile);
    }
}

function startMovingTimers() {
    clearInterval(politicianMoveInterval);
    clearInterval(reporterSpawnInterval);

    politicianMoveInterval = setInterval(function() {
        if (!gameOver) movePolitician();
    }, 1000);

    reporterSpawnInterval = setInterval(function() {
        if (!gameOver) spawnReporters();
    }, 2000);
}

function startCountdownTimer() {
    clearInterval(countdownTimerInterval);

    countdownTimerInterval = setInterval(function() {
        if (gameOver) {
            clearInterval(countdownTimerInterval);
            return;
        }
        timeLeft--;
        if (timeDisplay) timeDisplay.innerText = timeLeft;
        if (timeLeft <= 0) {
            timeLeft = 0;
            if (timeDisplay) timeDisplay.innerText = timeLeft;
            endTheGame();
            // clearInterval(countdownTimerInterval); // endTheGame will also clear it
        }
    }, 1000);
}

function clearBoardOfCharacters() {
    if (politicianTile) {
        politicianTile.innerHTML = "";
        politicianTile = null;
    }
    clearReporters();
}

function movePolitician() {
    if (gameOver) return;
    if (politicianTile) politicianTile.innerHTML = "";

    let politicianImg = document.createElement("img");
    politicianImg.src = "assets/images/trumpFace.png";

    let randomTileNumber, targetTile, attempts = 0;
    do {
        randomTileNumber = Math.floor(Math.random() * 9);
        targetTile = document.getElementById(String(randomTileNumber));
        attempts++;
    } while (targetTile && reporterTiles.includes(Number(targetTile.id)) && attempts < 20);

    if (targetTile && reporterTiles.includes(Number(targetTile.id))) return;

    politicianTile = targetTile;
    if (politicianTile) politicianTile.appendChild(politicianImg);
}

function spawnReporters() {
    if (gameOver) return;
    clearReporters();
    let numberOfReporters = Math.floor(Math.random() * 3) + 1;

    for (let i = 0; i < numberOfReporters; i++) {
        let randomTileNumber, tile, attempts = 0;
        do {
            randomTileNumber = Math.floor(Math.random() * 9);
            tile = document.getElementById(String(randomTileNumber));
            attempts++;
        } while (tile && ((politicianTile && randomTileNumber == politicianTile.id) || reporterTiles.includes(randomTileNumber)) && attempts < 20);
        
        if (tile && ((politicianTile && randomTileNumber == politicianTile.id) || reporterTiles.includes(randomTileNumber))) continue;

        let reporterImg = document.createElement("img");
        reporterImg.src = "assets/images/newsPerson.png";
        if (tile) {
            tile.appendChild(reporterImg);
            reporterTiles.push(randomTileNumber);
        }
    }
}

function clearReporters() {
    reporterTiles.forEach(tileId => {
        let tile = document.getElementById(String(tileId));
        if (tile) tile.innerHTML = "";
    });
    reporterTiles = [];
}

function tileClicked() {
    if (gameOver || !gameStarted) return;

    if (this == politicianTile) {
        score += 10;
        if (scoreDisplay) scoreDisplay.innerText = score;
        politicianClicks++;
        if (politicianClicks === 3) {
            playSound(successSound); // Use playSound
            // Reset politicianClicks if you want the sound to play every 3 clicks,
            // or let it continue counting if it's a one-time sound after the first 3.
            // politicianClicks = 0; // Optional: uncomment to make it every 3 clicks
        }
        movePolitician();
    } else if (reporterTiles.includes(Number(this.id))) {
        endTheGame();
    }
}

function endTheGame() {
    if (gameOver) return;
    gameOver = true;
    gameStarted = false;
    if(startBtnElement) startBtnElement.disabled = false;

    clearInterval(politicianMoveInterval);
    clearInterval(reporterSpawnInterval);
    clearInterval(countdownTimerInterval);

    if (scoreDisplay) scoreDisplay.innerText = "Game Over! Final Score: " + score + " Points";

    if (score >= 150) {
        playSound(gameOverWinningSound); // Use playSound
    } else {
        playSound(gameOverLosingSound); // Use playSound
    }
}

function restartGame() {
    clearInterval(politicianMoveInterval);
    clearInterval(reporterSpawnInterval);
    clearInterval(countdownTimerInterval);

    // Stop any sounds
    allGameSounds.forEach(audioEl => {
        if (audioEl && !audioEl.paused) {
            audioEl.pause();
            audioEl.currentTime = 0;
        }
    });

    score = 0;
    timeLeft = 60;
    gameOver = false;
    politicianTile = null;
    reporterTiles = [];
    politicianClicks = 0;
    gameStarted = false;

    updateScoreAndTimeDisplay();
    clearBoardOfCharacters();
    if (boardElement) boardElement.innerHTML = "";
    createGameBoard();

    if(startBtnElement) startBtnElement.disabled = false;
    if (scoreDisplay) scoreDisplay.innerText = score;
}

function openInstructions() {
    if (instructionsModal) instructionsModal.style.display = "block";
    playSound(trumpInstructionsSound); // Use playSound
}

function closeInstructions() {
    if (instructionsModal) instructionsModal.style.display = "none";
    // Optionally stop instructions sound if it's playing and modal is closed
    if (trumpInstructionsSound && !trumpInstructionsSound.paused) {
        trumpInstructionsSound.pause();
        trumpInstructionsSound.currentTime = 0;
    }
}

function outsideClickCloseModal(event) {
    if (instructionsModal && event.target == instructionsModal) {
        closeInstructions();
    }
}

function toggleMute() {
    isMuted = !isMuted;

    if (muteIconElement) {
        muteIconElement.src = isMuted ? "assets/images/muteIcon.png" : "assets/images/unMuted.png" ;
    }

    // Apply mute state to all audio elements
    const allAudioTags = document.querySelectorAll('audio');
    allAudioTags.forEach(audio => {
        audio.muted = isMuted;
    });

    // If unmuting, sounds won't autoplay; they play when triggered by playSound.
    // If muting, currently playing sound (managed by playSound) will become silent.
    // If a sound was playing and is muted, and then playSound tries to play another sound,
    // the first sound will be stopped by playSound's logic.
}