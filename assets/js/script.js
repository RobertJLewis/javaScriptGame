// Variables to keep track of the game state
let politicianTile; // The tile where the politician is
let reporterTiles = []; // An array to track all active reporter tiles
let score = 0;       // Player's score
let gameOver = false; // Is the game over?
let timeLeft = 60;   // Total game time in seconds
let politicianClicks = 0; // Track how many times the politician has been clicked

// When the page loads, set up the game
window.onload = function() {
    setupGame(); // Call the function to set up the game
    document.getElementById("restartBtn").addEventListener("click", restartGame); // Add a click event for restarting the game
    document.getElementById("instructionBtn").addEventListener("click", openInstructions); // Add a click event for opening the modal
    document.querySelector(".close").addEventListener("click", closeInstructions); // Add a click event for closing the modal
    window.addEventListener("click", outsideClickCloseModal); // Add event to close modal when clicking outside of it
}

// Set up the game by creating the board and starting timers
function setupGame() {
    createGameBoard(); // Create the tiles for the game
    startMovingTimers(); // Start moving the politician and reporters
    startCountdownTimer(); // Start the countdown timer
}

// Create a simple 3x3 game board with clickable tiles
function createGameBoard() {
    let board = document.getElementById("board"); // Get the board element
    for (let i = 0; i < 9; i++) { // Loop to create 9 tiles
        let tile = document.createElement("div"); // Create a new tile
        tile.id = i; // Give each tile a unique ID
        tile.classList.add("tile"); // Add a class for styling
        tile.addEventListener("click", tileClicked); // Add a click event to each tile
        board.appendChild(tile); // Add the tile to the board
    }
}

// Start the timers for moving the politician and reporters 
// JavaScript builtin methon if you havnt lost yet it will call a function -move politician (trump)
function startMovingTimers() {
    setInterval(function() {
        if (!gameOver) {
            movePolitician(); // Move the politician every second
        }
    }, 1000); // Every 1 second

    setInterval(function() {
        if (!gameOver) {
            spawnReporters(); // Spawn reporters every 2 seconds
        }
    }, 2000); // Every 2 seconds
}

// Start the countdown timer for the game
function startCountdownTimer() {
    let timer = setInterval(function() {
        if (gameOver) return; // Stop the timer if the game is over

        timeLeft--; // Decrease the time left by 1 second
        document.getElementById("time").innerText = timeLeft; // Update the time display

        if (timeLeft == 0) {
            endTheGame(); // End the game when time runs out
            clearInterval(timer); // Stop the countdown timer
        }
    }, 1000); // Every 1 second
}

// Move the politician to a random tile
function movePolitician() {
    if (gameOver) return; // Do nothing if the game is over

    // Remove the politician from the previous tile
    if (politicianTile) {
        politicianTile.innerHTML = ""; // Clear the old tile
    }

    let politician = document.createElement("img"); // Create an image for the politician
    politician.src = "assets/images/trumpFace.png"; // Set the image source

    let randomTileNumber = Math.floor(Math.random() * 9); // Pick a random tile number (0-8)
    if (reporterTiles.includes(randomTileNumber)) return; // Avoid overlapping with reporters

    politicianTile = document.getElementById(randomTileNumber); // Get the random tile
    politicianTile.appendChild(politician); // Place the politician on the tile
}

// Spawn multiple reporters on random tiles
function spawnReporters() {
    if (gameOver) return; // Do nothing if the game is over

    // Clear all existing reporters from the board
    clearReporters();

    // Randomly decide how many reporters to spawn (1 to 3)
    let numberOfReporters = Math.floor(Math.random() * 3) + 1;

    for (let i = 0; i < numberOfReporters; i++) {
        let randomTileNumber = Math.floor(Math.random() * 9); // Pick a random tile number (0-8)

        // Avoid overlapping with the politician or other reporters
        if (randomTileNumber == politicianTile?.id || reporterTiles.includes(randomTileNumber)) {
            continue; // Skip this tile and try again
        }

        let reporter = document.createElement("img"); // Create an image for the reporter
        reporter.src = "assets/images/newsPerson.png"; // Set the image source

        let tile = document.getElementById(randomTileNumber); // Get the random tile
        tile.appendChild(reporter); // Place the reporter on the tile
        reporterTiles.push(randomTileNumber); // Track the reporter's tile
    }
}

// Clear all reporters from the board
function clearReporters() {
    reporterTiles.forEach(tileId => {
        let tile = document.getElementById(tileId);
        tile.innerHTML = ""; // Clear the tile
    });
    reporterTiles = []; // Reset the reporter tiles array
}

// Handle what happens when a tile is clicked
function tileClicked() {
    if (gameOver) return; // Do nothing if the game is over

    // Check if the clicked tile has the politician
    if (this == politicianTile) {
        score += 10; // Increase the score
        document.getElementById("score").innerText = score; // Update the score display

        // Increment the politician click counter
        politicianClicks++;

        // Check if the politician has been clicked 3 times
        if (politicianClicks === 3) {
            let successSound = document.getElementById("success"); // Get the audio element
            successSound.play(); // Play the sound
        }
    }

    // Check if the clicked tile has a reporter
    else if (reporterTiles.includes(Number(this.id))) {
        endTheGame(); // End the game if a reporter is clicked
    }
}

// End the game
function endTheGame() {
    if (gameOver) return; // Do nothing if the game is already over

    gameOver = true; // Set the game over flag
    document.getElementById("score").innerText = "Game Over! Final Score: " + score + " " + "Points"; // Show the final score

    // Play the game over sound
    let gameOverLosingSound = document.getElementById("gameOverLosingSound"); // Selecting sounds from HTML (losing)
    let gameOverWinningSound = document.getElementById("gameOverWinningSound"); // Selecting sounds from HTML (Winning)

    if (score >=150) {
        gameOverWinningSound.play()
    } else {
        gameOverLosingSound.play()
    }
}

/**
* This function restarts the game
*/
function restartGame() {
    // Reset all variables
    score = 0;
    timeLeft = 60;
    gameOver = false;
    politicianTile = null;
    reporterTiles = [];
    politicianClicks = 0; // Reset the politician click counter

    // Clear the board
    document.getElementById("board").innerHTML = "";
    createGameBoard(); // Re-create the game board

    // Reset the score and time display
    document.getElementById("score").innerText = score;
    document.getElementById("time").innerText = timeLeft;

    setupGame(); // Restart the game
}

// Instruction sound
document.getElementById("instructionBtn").addEventListener("click", function() {
    const audio = document.getElementById("trumpInstructions");
    audio.play();
});

// When the mute icon is clicked
document.getElementById("muteIcon").addEventListener("click", function() {
    // Get the mute sound element
    const audio = document.getElementById("muteSound");

    // Get all audio elements on the page
    const allAudio = document.querySelectorAll('audio');
    
    // Stop all audio elements that are playing
    for (let i = 0; i < allAudio.length; i++) {
        if (!allAudio[i].paused) {
            allAudio[i].pause();
        }
    }

    // If the mute sound is not playing, play it. If it is playing, pause it.
    if (audio.paused) {
        audio.play();
    } else {
        audio.pause();
    }
});


// Function to open the instructions modal
function openInstructions() {
    document.getElementById("instructionsModal").style.display = "block";
}

// Function to close the instructions modal
function closeInstructions() {
    document.getElementById("instructionsModal").style.display = "none";
}

/**
* close modal
*/
function outsideClickCloseModal(event) {
    if (event.target == document.getElementById("instructionsModal")) {
        closeInstructions(); 
    }
}

/**
* push test for github
*/
