let secretNumber = Math.trunc(Math.random() * 20) + 1;

let score = 20;

let highScore = 0;

document.querySelector(".check").addEventListener("click", function () {
  const guess = Number(document.querySelector(".guess").value);
  // if there is no input //
  if (!guess) {
    document.querySelector(".message").textContent = "NO Number!!!!";
  }
  // if the guessing number higher than the secretNumber //
  else if (guess > secretNumber) {
    if (score > 1) {
      document.querySelector(".score").textContent = --score;
      document.querySelector(".message").textContent = "Too High...";
    } else {
      document.querySelector(".message").textContent = "You Lost The Game!";
      document.querySelector(".score").textContent = 0;
    }
  }
  // if the guessing number lower than the secretNumber //
  else if (guess < secretNumber) {
    if (score > 1) {
      document.querySelector(".score").textContent = --score;
      document.querySelector(".message").textContent = "Too Low...";
    } else {
      document.querySelector(".message").textContent = "You Lost The Game!";
      document.querySelector(".score").textContent = 0;
    }
  }
  // if the guessing number the true number //
  else if (guess === secretNumber) {
    document.querySelector(".message").textContent = "Correct Number 🎉🎉";
    document.querySelector("body").style.backgroundColor = "#60b347";
    document.querySelector(".number").textContent = secretNumber;
    if (score > highScore) {
      highScore = score;
      document.querySelector(".highscore").textContent = highScore;
    }
  }
});

// Restore the game //

document.querySelector(".again").addEventListener("click", function () {
  secretNumber = Math.trunc(Math.random() * 20) + 1;
  score = 20;
  document.querySelector(".score").textContent = score;
  document.querySelector(".number").textContent = "?";
  document.querySelector(".message").textContent = "Start Guessing...";
  document.querySelector(".guess").value = "";
  document.querySelector("body").style.backgroundColor = "#222";
});
