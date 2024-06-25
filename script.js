const suits = ["♣️", "♥️", "♦️", "♠️"];
const values = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
  "A",
];

let deck = [];
let playerHand = [];
let dealerHand = [];

const gameResult = document.getElementById("gameResult");

function createDeck() {
  for (let suit of suits) {
    for (let value of values) {
      deck.push({ suit, value });
    }
  }
}

function shuffleDeck() {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

function dealCard() {
  if (deck.length === 0) {
    createDeck();
    shuffleDeck();
  }
  return deck.pop();
}

function startGame() {
  gameResult.innerHTML = "";
  createDeck();
  shuffleDeck();

  playerHand = [dealCard(), dealCard()];
  dealerHand = [dealCard(), dealCard()];

  updateDisplay(playerHand, dealerHand);
}

function hit() {
  playerHand.push(dealCard());
  updateDisplay(playerHand, dealerHand);

  if (getScore(playerHand) > 21) {
    gameResult.innerHTML = "Bust! You lose.";
    return;
  }
}

function stand() {
  while (getScore(dealerHand) < 17) {
    dealerHand.push(dealCard());
    updateDisplay(playerHand, dealerHand);
  }
  if (getScore(dealerHand) > 21) {
    gameResult.innerHTML = "Dealer busts! You win!";
    return;
  } else if (getScore(playerHand) > getScore(dealerHand)) {
    gameResult.innerHTML = "You win!";
  } else if (getScore(playerHand) < getScore(dealerHand)) {
    gameResult.innerHTML = "You lose.";
  } else {
    gameResult.innerHTML = "It's a tie!";
  }
  updateDisplay(playerHand, dealerHand);
}

function getScore(hand) {
  let score = 0;
  let hasAce = false;
  for (let card of hand) {
    if (card.value === "A") {
      hasAce = true;
      score += 11;
    } else if (card.value === "J" || card.value === "Q" || card.value === "K") {
      score += 10;
    } else {
      score += parseInt(card.value);
    }
  }
  if (hasAce && score > 21) {
    score -= 10;
  }
  return score;
}

function updateDisplay(playerHand, dealerHand) {
  let playerScore = getScore(playerHand);
  let dealerScore = getScore(dealerHand);

  let playerHandString = playerHand
    .map((card) => `${card.value}${card.suit}`)
    .join(" ");
  let dealerHandString = dealerHand
    .map((card) => `${card.value}${card.suit}`)
    .join(" ");

  document.getElementById("playerHand").innerHTML = playerHandString;
  document.getElementById("playerScore").innerHTML = playerScore;

  document.getElementById("dealerHand").innerHTML = dealerHandString;
  document.getElementById("dealerScore").innerHTML = dealerScore;
}
