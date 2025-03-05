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