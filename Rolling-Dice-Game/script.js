// selecting elements //
const player0 = document.querySelector(".player--0");
const player1 = document.querySelector(".player--1");
const score0 = document.querySelector("#score--0");
const score1 = document.getElementById("score--1");
const dice = document.querySelector(".dice");
const btnRoll = document.querySelector(".btn--roll");
const btnNew = document.querySelector(".btn--new");
const btnHold = document.querySelector(".btn--hold");
const currentEl = document.querySelector(".current-score");

// start conditions //
score0.textContent = 0;
score1.textContent = 0;
dice.classList.add("hidden");

let finalScores = [0, 0];
let currentScore = 0;
let activePlayer = 0; // to indicate the active player //
let playing = true; // the state of the game still playing or not //

// switch the player function //
function switchPlayer() {
  document.getElementById(`current--${activePlayer}`).textContent = 0;
  currentScore = 0;
  activePlayer = activePlayer === 1 ? 0 : 1;
  player0.classList.toggle("player--active");
  player1.classList.toggle("player--active");
}

// rolling the dice //
btnRoll.addEventListener("click", function () {
  if (playing) {
    // make a random varible from 1 to 6 //
    const diceNum = Math.trunc(Math.random() * 6) + 1;
    // change the source of the image //
    dice.src = `./images/dice-${diceNum}.png`;
    // remove the hidden class to display the dice //
    dice.classList.remove("hidden");
    // check if should i switch the player //
    if (diceNum !== 1) {
      // add the diceNum to the current score //
      currentScore += diceNum;
      document.getElementById(`current--${activePlayer}`).textContent =
        currentScore;
    } else {
      // switch the player //
      switchPlayer();
    }
  }
});

// hold the current the score //
btnHold.addEventListener("click", function () {
  if (playing) {
    // add the current score to the active player score //
    finalScores[activePlayer] += currentScore;
    document.getElementById(`score--${activePlayer}`).textContent =
      finalScores[activePlayer];
    // check if player win //
    if (finalScores[activePlayer] > 20) {
      playing = false;
      // remove the dice image //
      dice.classList.add("hidden");
      document
        .querySelector(`.player--${activePlayer}`)
        .classList.add("player--winner");
      // document
      //   .querySelector(`.player--${activePlayer}`)
      //   .classList.remove("player--active");
    } else {
      // switch after holding the score //
      switchPlayer();
    }
  }
});

// reseting the game //
btnNew.addEventListener("click", function () {
  finalScores = [0, 0];
  currentScore = 0;
  activePlayer = 0;
  playing = true;
  dice.classList.add("hidden");
  player0.classList.remove("player--winner");
  player1.classList.remove("player--winner");
  player0.classList.add("player--active");
  player1.classList.remove("player--active");
  document.getElementById("score--0").textContent = 0;
  document.getElementById("score--1").textContent = 0;
  document.getElementById("current--0").textContent = 0;
  document.getElementById("current--1").textContent = 0;
});
