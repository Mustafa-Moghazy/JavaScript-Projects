// selecting elements //
const score0 = document.querySelector("#score--0");
const score1 = document.getElementById("score--1");
const dice = document.querySelector(".dice");
const btnRoll = document.querySelector(".btn--roll");
const btnNew = document.querySelector(".btn--new");
const btnHold = document.querySelector(".btn--hold");

// start conditions //
score0.textContent = 0;
score1.textContent = 0;
dice.classList.add("hidden");

// rolling the dice //
btnRoll.addEventListener("click", function () {
  // make a random varible from 1 to 6 //
  const diceNum = Math.trunc(Math.random() * 6) + 1;
  // change the source of the image //
  dice.src = `./images/dice-${diceNum}.png`;
  // remove the hidden class to display the dice //
  dice.classList.remove("hidden");
  // check if should i switch the player //
  if (diceNum !== 1) {
    // add the diceNum to the current score //
  } else {
    // switch the player //
  }
});
