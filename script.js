// Herní proměnné
let startTime;
let round = 0;
let totalTime = 0;
let maxRounds = 5;
let gameActive = false;
let timeoutId = null;

// DOM elementy
const target = document.getElementById("target");
const timeDisplay = document.getElementById("time");
const bestScoreDisplay = document.getElementById("bestScore");
const roundDisplay = document.getElementById("round");

// Načtení nejlepšího skóre
if (localStorage.getItem("bestScore")) {
    bestScoreDisplay.innerText = localStorage.getItem("bestScore");
}

// Funkce pro start hry
function startGame() {
    if (gameActive) {
        alert("Hra již běží! Dokonči aktuální kolo.");
        return;
    }
    
    round = 0;
    totalTime = 0;
    gameActive = true;
    timeDisplay.innerText = "0";
    updateRoundDisplay();
    nextRound();
}

// Funkce pro další kolo
function nextRound() {
    if (round >= maxRounds) {
        endGame();
        return;
    }

    round++;
    updateRoundDisplay();

    // Náhodné zpoždění 1-3 sekundy
    let randomDelay = Math.random() * 2000 + 1000;

    // Zrušíme předchozí timeout pokud existuje
    if (timeoutId) {
        clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
        showTarget();
        startTime = new Date().getTime();
    }, randomDelay);
}

// Zobrazení čtverce na náhodné pozici
function showTarget() {
    let x = Math.random() * 540; // 600 - 60
    let y = Math.random() * 340; // 400 - 60

    target.style.left = x + "px";
    target.style.top = y + "px";
    target.style.display = "block";
    target.style.backgroundColor = "#38bdf8"; // default modrá
}

// Kliknutí na čtverec
target.onclick = function () {
    if (!gameActive || target.style.display === "none") return;
    
    let endTime = new Date().getTime();
    let reactionTime = endTime - startTime;

    // Barevné označení podle rychlosti
    if (reactionTime < 300) {
        target.style.backgroundColor = "#4ade80"; // zelená
    } else if (reactionTime < 500) {
        target.style.backgroundColor = "#fbbf24"; // oranžová
    } else {
        target.style.backgroundColor = "#f87171"; // červená
    }

    // Krátce necháme barvu před zmizením
    setTimeout(() => {
        target.style.display = "none";
    }, 100);

    timeDisplay.innerText = reactionTime;
    totalTime += reactionTime;

    // Zrušíme timeout pro další kolo (kdyby náhodou)
    if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
    }

    // Další kolo po krátké pauze
    setTimeout(() => {
        nextRound();
    }, 200);
};

// Ukončení hry
function endGame() {
    gameActive = false;
    let average = Math.round(totalTime / maxRounds);
    
    // Zobrazíme výsledek v alertu
    let message = `🎮 Konec hry!\n\n`;
    message += `📊 Průměrný čas: ${average} ms\n`;
    
    if (reaction < 300) {
        message += `🏆 Výborný výkon!`;
    } else if (reaction < 500) {
        message += `👍 Dobrý průměr!`;
    } else {
        message += `💪 Zkus to znovu!`;
    }
    
    alert(message);

    // Uložení nejlepšího skóre
    let bestScore = localStorage.getItem("bestScore");
    if (!bestScore || average < parseInt(bestScore)) {
        localStorage.setItem("bestScore", average);
        bestScoreDisplay.innerText = average;
        
        // Speciální efekt pro nový rekord
        target.style.backgroundColor = "#fbbf24";
        setTimeout(() => {
            target.style.backgroundColor = "#38bdf8";
        }, 500);
    }
}

// Reset nejlepšího skóre
function resetBestScore() {
    if (confirm("Opravdu chceš smazat nejlepší skóre?")) {
        localStorage.removeItem("bestScore");
        bestScoreDisplay.innerText = "-";
        alert("Nejlepší skóre bylo resetováno!");
    }
}

// Aktualizace zobrazení kola
function updateRoundDisplay() {
    roundDisplay.innerText = round;
}

// Ochrana proti kliknutí mimo čtverec
document.getElementById("gameArea").onclick = function (e) {
    if (e.target.id !== "target" && gameActive && target.style.display !== "none") {
        // Trest za kliknutí mimo - ztráta času
        totalTime += 200;
        timeDisplay.innerText = "MIMO! +200 ms";
        timeDisplay.style.color = "#f87171";
        
        setTimeout(() => {
            timeDisplay.style.color = "";
        }, 500);
    }
};