const squares = document.querySelectorAll('.square');
const score = document.querySelector('#score');
const timeLeft = document.querySelector('#time-left');
const difficultySelect = document.querySelector('#difficulty-level');
const startButton = document.querySelector('#start-button');
const restartButton = document.getElementById('restart-button');
const buonoSound = new Audio('/assets/homemadeoof.mp3');
const cattivoSound = new Audio('/assets/pain-sound-in-mask.mp3');

// HomemadeOof by Thedavedude (Freesound)
// Pain Sound in Mask by Hoggington (Freesound)

let result = 0;
let currentTime = 60;
let hitPosition;
let timerId;
let countdownTimerId;
let currentSpeed = 1000;
let difficultyLevel = 'easy'; // nuova variabile, livello di difficoltà (predefinito)

// configurazione dei livelli di difficoltà
const difficulties = {
    'easy': {
        speed: 1200,
        // la velocità rimane costante nel livello facile
        updateSpeed: function() {
            return this.speed;
        }
    },
    'medium': {
        speed: 900,
        // la velocità rimane costante nel livello medio
        updateSpeed: function() {
            return this.speed;
        }
    },
    'hard': {
        speed: 900,
        updateSpeed: function(elapsedSeconds) {
            // aumenta la velocità più lentamente e mai al di sotto di 500 ms
            return Math.max(500, this.speed - (elapsedSeconds * 10));
        }
    }
};

function randomSquare() {
    // Puliamo tutti i quadrati
    squares.forEach((square) => {
        square.classList.remove(
            'emoji-buono',
            'emoji-cattivo',
            'clicked-buono',
            'clicked-cattivo'
        );
    });
    // Prendiamo un quadrato casuale
    let randomSquare = squares[Math.floor(Math.random() * 9) + 1];
    
    // decidi a caso se è buono o cattivo
    const isBuono = Math.random() < 0.5; // 50% chance

    // aggiungi le classi 'emoji-buono' e 'emoji-cattivo'
    if (isBuono) {
        randomSquare.classList.add('emoji-buono');
    } else {
        randomSquare.classList.add('emoji-cattivo');
    }

    // salviamo la posizione del quadrato giusto
    hitPosition = randomSquare.id;
}

function moveEmoji() {
    // utilizziamo la velocità corrente
    timerId = setInterval(randomSquare, currentSpeed);
}

function updateSpeed() {
    // aggiorna la velocità in base al livello di difficoltà e al tempo trascorso
    const elapsedSeconds = 60 - currentTime;
    currentSpeed = difficulties[difficultyLevel].updateSpeed(elapsedSeconds);
    
    // se siamo in modalità difficile, aggiorniamo l'intervallo
    if (difficultyLevel === 'hard') {
        clearInterval(timerId);
        timerId = setInterval(randomSquare, currentSpeed);
    }
}

function countdown() {
    // Decrementa il tempo rimanente di un secondo
    currentTime--;
    timeLeft.textContent = currentTime; // Aggiorna il tempo rimanente sullo schermo

    // aggiorna la velocità se necessario
    updateSpeed();

    // Se il tempo è scaduto, ferma il gioco
    if (currentTime === 0) {
        // clearInterval(timerId); // Ferma il timer dell'emoji
        // clearInterval(countdownTimerId); // Ferma il timer del countdown
        // alert('Game Over! Your score is ' + result); // Mostra il punteggio finale
        endGame(); // utilizziamo una nuova funzione
    }
}

function endGame(showAlert = true) {
    // // incolla righe da funzione countdown
    clearInterval(timerId); // Ferma il timer dell'emoji
    clearInterval(countdownTimerId); // Ferma il timer del countdown
    // alert('Game Over! Il tuo punteggio è ' + result); // Mostra il punteggio finale

    // // riabilita la selezione e il pulsante dopo la fine del gioco
    // difficultySelect.disabled = false;
    // startButton.disabled = false;

    // // rimuovi gli emoji da tutti i quadrati
    // squares.forEach((square) => {
    //     square.classList.remove('emoji');
    // });

    if (showAlert) {
        alert('Game Over! Il tuo punteggio è ' + result);
    }

    difficultySelect.disabled = false;
    startButton.disabled = false;

    // cancella tutti gli emoji e le classi dai quadrati
    squares.forEach((square) => {
        square.classList.remove(
            'emoji-buono',
            'emoji-cattivo',
            'clicked-buono',
            'clicked-cattivo'
        );
    });

    hitPosition = null;
}

function startGame() {
    // ferma eventuali timer esistenti prima di riavviare
    if (timerId) clearInterval(timerId);
    if (countdownTimerId) clearInterval(countdownTimerId);

    // resetta i valori
    result = 0;
    currentTime = 60;
    score.textContent = 0;
    timeLeft.textContent = 60;
    
    // ottieni il livello di difficoltà selezionato
    difficultyLevel = difficultySelect.value;
    
    // imposta la velocità iniziale
    currentSpeed = difficulties[difficultyLevel].speed;
    
    // disabilita la selezione e il pulsante durante il gioco
    difficultySelect.disabled = true;
    startButton.disabled = true;

    // avvia i timer del gioco
    moveEmoji();
    countdownTimerId = setInterval(countdown, 1000);
}

squares.forEach((square) => {
    // Aggiungi un evento di ascolto per il click su ogni quadrato
    square.addEventListener('mousedown', () => {
        // Se il quadrato cliccato è quello giusto
        if (square.classList.contains('emoji-buono')) {
            result++;
            score.textContent = result;
            square.classList.add('clicked-buono');
            buonoSound.currentTime = 0;
            buonoSound.play();
            hitPosition = null;
        // se no
        } else if (square.classList.contains('emoji-cattivo')) {
            result--;
            score.textContent = result;
            square.classList.add('clicked-cattivo');
            cattivoSound.currentTime = 0;
            cattivoSound.play();
            hitPosition = null;
        }
        // if (square.id === hitPosition) {
        //     result++; // Incrementa il punteggio
        // score.textContent = result; // Aggiorna il punteggio sullo schermo
        // hitPosition = null; // Resetta l'indice dell'emoji // svuota la posizione evitando doppi punteggi

        // rimuovi l'emoji dopo un breve ritardo (ripristina per il round successivo)
        setTimeout(() => {
            square.classList.remove(
                'emoji-buono',
                'emoji-cattivo',
                'clicked-buono',
                'clicked-cattivo'
            );
        }, 400);
    });
});

// aggiungi event listener ai pulsanti
startButton.addEventListener('click', startGame);

restartButton.addEventListener('click', () => {
    endGame(false); // salta alert
    difficultySelect.disabled = false;
    startButton.disabled = false;
    // lascia che il giocatore scelga di nuovo la difficoltà prima dell'inizio successivo
});