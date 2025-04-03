// Game state variables
let player1Name = "";
let player2Name = "";
let player1Cards = [];
let player2Cards = [];
let player1Card = "";
let player2Card = "";
let roundNumber = 1;
let scores = { player1: 0, player2: 0 };
let currentPlayer = "player1";

// Initialize event listeners
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("start-game").addEventListener("click", startGame);
    document.getElementById("confirm-player1").addEventListener("click", confirmPlayer1);
    document.getElementById("p1-seen").addEventListener("click", p1SeenCards);
    document.getElementById("confirm-player2").addEventListener("click", confirmPlayer2);
    document.getElementById("p2-seen").addEventListener("click", p2SeenCards);
    document.getElementById("confirm-p1-reconfirm").addEventListener("click", p1Reconfirm);
    document.getElementById("confirm-p2-reconfirm").addEventListener("click", p2Reconfirm);
    document.getElementById("p1-confirm-card").addEventListener("click", p1ConfirmSelection);
    document.getElementById("p2-confirm-card").addEventListener("click", p2ConfirmSelection);
    document.getElementById("reveal-cards").addEventListener("click", revealCards);
    document.getElementById("restart-btn").addEventListener("click", restartGame);
});

// Random card distribution
function initializeCards() {
    // Randomly decide who gets Emperor (E) and who gets Slave (S)
    // if (Math.random() < 0.5) {
        player1Cards = ["E", "C", "C", "C"];
        player2Cards = ["S", "C", "C", "C"];
    // } else {
    //     player1Cards = ["S", "C", "C", "C"];
    //     player2Cards = ["E", "C", "C", "C"];
    // }
}

// Main game functions
function startGame() {
    player1Name = document.getElementById("player1-name").value.trim();
    player2Name = document.getElementById("player2-name").value.trim();

    if (player1Name && player2Name) {
        initializeCards(); // Random card distribution
        console.log("Player 1 cards:", player1Cards);
        console.log("Player 2 cards:", player2Cards);
        document.getElementById("player-info").classList.add("hidden");
        document.getElementById("player1-title").textContent = `Are you ${player1Name}?`;
        document.getElementById("confirm-player1").textContent = `I am ${player1Name}`;
        document.getElementById("player1-confirm").classList.remove("hidden");
    } else {
        alert("Please enter names for both players.");
    }
}

function confirmPlayer1() {
    document.getElementById("player1-confirm").classList.add("hidden");
    document.getElementById("p1-cards-title").textContent = `Cards for ${player1Name}`;
    document.getElementById("player1-cards").classList.remove("hidden");
    showPlayerCards("p1-cards", player1Cards);
}

function p1SeenCards() {
    document.getElementById("player1-cards").classList.add("hidden");
    document.getElementById("player2-title").textContent = `Are you ${player2Name}?`;
    document.getElementById("confirm-player2").textContent = `I am ${player2Name}`;
    document.getElementById("player2-confirm").classList.remove("hidden");
}

function confirmPlayer2() {
    document.getElementById("player2-confirm").classList.add("hidden");
    document.getElementById("p2-cards-title").textContent = `Cards for ${player2Name}`;
    document.getElementById("player2-cards").classList.remove("hidden");
    showPlayerCards("p2-cards", player2Cards);
}

function p2SeenCards() {
    document.getElementById("player2-cards").classList.add("hidden");
    document.getElementById("p1-reconfirm-title").textContent = `Are you still ${player1Name}?`;
    document.getElementById("player1-reconfirm").classList.remove("hidden");
}

function p1Reconfirm() {
    document.getElementById("player1-reconfirm").classList.add("hidden");
    document.getElementById("player1-choose").classList.remove("hidden");
    document.getElementById("p1-choose-title").textContent = `Choose Your Card, ${player1Name}`;
    showSelectableCards("p1-choose-cards", player1Cards, "player1");
    currentPlayer = "player1";
}

function p2Reconfirm() {
    document.getElementById("player2-reconfirm").classList.add("hidden");
    document.getElementById("player2-choose").classList.remove("hidden");
    document.getElementById("p2-choose-title").textContent = `Choose Your Card, ${player2Name}`;
    showSelectableCards("p2-choose-cards", player2Cards, "player2");
    currentPlayer = "player2";
}

function showSelectableCards(containerId, cards, player) {
    const container = document.createElement("div");
    container.id = containerId;
    container.className = "card-container";
    
    const parent = player === "player1" 
        ? document.getElementById("player1-choose")
        : document.getElementById("player2-choose");
        
    const oldContainer = parent.querySelector(".card-container");
    if (oldContainer) parent.removeChild(oldContainer);
    
    cards.forEach((card, index) => {
        const cardElement = document.createElement("div");
        cardElement.className = "selectable-card";
        cardElement.textContent = card === "E" ? "Emperor" : 
                               card === "S" ? "Slave" : "Citizen";
        cardElement.dataset.value = card;
        cardElement.dataset.index = index;
        
        cardElement.addEventListener("click", function() {
            const selected = container.querySelector(".selected");
            if (selected) selected.classList.remove("selected");
            this.classList.add("selected");
            
            if (player === "player1") {
                player1Card = this.dataset.value;
            } else {
                player2Card = this.dataset.value;
            }
        });
        
        container.appendChild(cardElement);
    });
    
    parent.appendChild(container);
}

function p1ConfirmSelection() {
    if (!player1Card) {
        alert("Please select a card first!");
        return;
    }
    
    document.getElementById("player1-choose").classList.add("hidden");
    currentPlayer = "player2";
    document.getElementById("p2-reconfirm-title").textContent = `Are you still ${player2Name}?`;
    document.getElementById("player2-reconfirm").classList.remove("hidden");
}

function p2ConfirmSelection() {
    if (!player2Card) {
        alert("Please select a card first!");
        return;
    }
    
    document.getElementById("player2-choose").classList.add("hidden");
    document.getElementById("reveal-confirm").classList.remove("hidden");
}

function revealCards() {
    document.getElementById("reveal-confirm").classList.add("hidden");
    document.getElementById("game-board").classList.remove("hidden");
    revealWinner();
}

function showPlayerCards(containerId, cards) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";
    cards.forEach(card => {
        const cardElement = document.createElement("div");
        cardElement.classList.add("card");
        cardElement.textContent = card === "E" ? "Emperor" : 
                               card === "S" ? "Slave" : "Citizen";
        container.appendChild(cardElement);
    });
}

function removeFirstCitizen(cards) {
    const index = cards.indexOf("C");
    if (index !== -1) {
        cards.splice(index, 1);
    }
    return cards;
}

function revealWinner() {
    let result = "";

    if (player1Card === "E" && player2Card === "C") {
        result = `${player1Name} wins!`;
        scores.player1++;
    } else if (player1Card === "C" && player2Card === "E") {
        result = `${player2Name} wins!`;
        scores.player2++;
    } else if (player1Card === "S" && player2Card === "E") {
        result = `${player1Name} wins!`;
        scores.player1++;
    } else if (player1Card === "E" && player2Card === "S") {
        result = `${player2Name} wins!`;
        scores.player2++;
    } else if (player1Card === "C" && player2Card === "S") {
        result = `${player1Name} wins!`;
        scores.player1++;
    } else if (player1Card === "S" && player2Card === "C") {
        result = `${player2Name} wins!`;
        scores.player2++;
    } else if (player1Card === "C" && player2Card === "C") {
        removeFirstCitizen(player1Cards);
        removeFirstCitizen(player2Cards);

        document.getElementById("turn-indicator").textContent = "It's a draw! One card removed...";

        setTimeout(() => {
            if (player1Cards.length > 0 && player2Cards.length > 0) {
                currentPlayer = "player1";
                document.getElementById("p1-reconfirm-title").textContent = `Are you still ${player1Name}?`;
                document.getElementById("player1-reconfirm").classList.remove("hidden");
            } else {
                document.getElementById("turn-indicator").textContent = "Game over! No cards left.";
                document.getElementById("restart-btn").classList.remove("hidden");
            }
        }, 2000);
        return;
    }

    document.getElementById("turn-indicator").textContent = result;
    document.getElementById("game-board").classList.add("hidden");
    document.getElementById("winner-board").classList.remove("hidden");
    document.getElementById("winner-name").textContent = result;
}

function restartGame() {
    location.reload();
}
