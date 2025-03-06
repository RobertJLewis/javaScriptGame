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

// Create a 3x3 board with clickable tiles
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

function tileClicked() {
    if (gameOver) return; // Do nothing if the game is over
}

// Move the politician to a random tile
function movePolitician() {
    if (gameOver) return; // Do nothing if the game is over

    // Remove the politician from the previous tile
    if (politicianTile) {
        politicianTile.innerHTML = ""; // Clear the old tile
    }
    
    let politician = document.createElement("img"); // Create an image for the politician
    politician.src = "./trumpFace.png"; // Set the image source

    let randomTileNumber = Math.floor(Math.random() * 9); // Pick a random tile number (0-8)
    if (reporterTiles.includes(randomTileNumber)) return; // Avoid overlapping with reporters

    politicianTile = document.getElementById(randomTileNumber); // Get the random tile
    politicianTile.appendChild(politician); // Place the politician on the tile
}
