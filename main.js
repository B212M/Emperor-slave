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

// Card translations
const cardTranslations = {
    "E": "إمبراطور",
    "S": "عبد",
    "C": "مواطن"
};

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
    if (Math.random() < 0.5) {
        player1Cards = ["E", "C", "C", "C"];
        player2Cards = ["S", "C", "C", "C"];
    } else {
        player1Cards = ["S", "C", "C", "C"];
        player2Cards = ["E", "C", "C", "C"];
    }
}

// Main game functions
function startGame() {
    player1Name = document.getElementById("player1-name").value.trim();
    player2Name = document.getElementById("player2-name").value.trim();

    if (player1Name && player2Name) {
        initializeCards();
        document.getElementById("player-info").classList.add("hidden");
        document.getElementById("player1-title").textContent = `هل أنت ${player1Name}؟`;
        document.getElementById("confirm-player1").textContent = `نعم، أنا ${player1Name}`;
        document.getElementById("player1-confirm").classList.remove("hidden");
    } else {
        alert("الرجاء إدخال أسماء اللاعبين");
    }
}

function confirmPlayer1() {
    document.getElementById("player1-confirm").classList.add("hidden");
    document.getElementById("p1-cards-title").textContent = `بطاقات ${player1Name}`;
    document.getElementById("player1-cards").classList.remove("hidden");
    showPlayerCards("p1-cards", player1Cards);
}

function p1SeenCards() {
    document.getElementById("player1-cards").classList.add("hidden");
    document.getElementById("player2-title").textContent = `هل أنت ${player2Name}؟`;
    document.getElementById("confirm-player2").textContent = `نعم، أنا ${player2Name}`;
    document.getElementById("player2-confirm").classList.remove("hidden");
}

function confirmPlayer2() {
    document.getElementById("player2-confirm").classList.add("hidden");
    document.getElementById("p2-cards-title").textContent = `بطاقات ${player2Name}`;
    document.getElementById("player2-cards").classList.remove("hidden");
    showPlayerCards("p2-cards", player2Cards);
}

function p2SeenCards() {
    document.getElementById("player2-cards").classList.add("hidden");
    document.getElementById("p1-reconfirm-title").textContent = `هل ما زلت ${player1Name}؟`;
    document.getElementById("player1-reconfirm").classList.remove("hidden");
}

function p1Reconfirm() {
    document.getElementById("player1-reconfirm").classList.add("hidden");
    document.getElementById("player1-choose").classList.remove("hidden");
    document.getElementById("p1-choose-title").textContent = `اختر بطاقتك، ${player1Name}`;
    showSelectableCards("p1-choose-cards", player1Cards, "player1");
    currentPlayer = "player1";
}

function p2Reconfirm() {
    document.getElementById("player2-reconfirm").classList.add("hidden");
    document.getElementById("player2-choose").classList.remove("hidden");
    document.getElementById("p2-choose-title").textContent = `اختر بطاقتك، ${player2Name}`;
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
        cardElement.textContent = cardTranslations[card];
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
        alert("الرجاء اختيار بطاقة أولاً!");
        return;
    }
    
    document.getElementById("player1-choose").classList.add("hidden");
    currentPlayer = "player2";
    document.getElementById("p2-reconfirm-title").textContent = `هل ما زلت ${player2Name}؟`;
    document.getElementById("player2-reconfirm").classList.remove("hidden");
}

function p2ConfirmSelection() {
    if (!player2Card) {
        alert("الرجاء اختيار بطاقة أولاً!");
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
        cardElement.textContent = cardTranslations[card];
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
        result = `${player1Name} فاز!`;
        scores.player1++;
    } else if (player1Card === "C" && player2Card === "E") {
        result = `${player2Name} فاز!`;
        scores.player2++;
    } else if (player1Card === "S" && player2Card === "E") {
        result = `${player1Name} فاز!`;
        scores.player1++;
    } else if (player1Card === "E" && player2Card === "S") {
        result = `${player2Name} فاز!`;
        scores.player2++;
    } else if (player1Card === "C" && player2Card === "S") {
        result = `${player1Name} فاز!`;
        scores.player1++;
    } else if (player1Card === "S" && player2Card === "C") {
        result = `${player2Name} فاز!`;
        scores.player2++;
    } else if (player1Card === "C" && player2Card === "C") {
        document.getElementById("draw-animation").classList.remove("hidden");
        removeFirstCitizen(player1Cards);
        removeFirstCitizen(player2Cards);

        document.getElementById("turn-indicator").textContent = "تعادل! تم إزالة بطاقة واحدة...";

        setTimeout(() => {
            if (player1Cards.length > 0 && player2Cards.length > 0) {
                currentPlayer = "player1";
                document.getElementById("p1-reconfirm-title").textContent = `هل ما زلت ${player1Name}؟`;
                document.getElementById("player1-reconfirm").classList.remove("hidden");
            } else {
                document.getElementById("turn-indicator").textContent = "انتهت اللعبة! لا توجد بطاقات متبقية.";
                document.getElementById("restart-btn").classList.remove("hidden");
            }
        }, 3000);
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
